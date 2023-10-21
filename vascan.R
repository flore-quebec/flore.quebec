
library(data.table)
library(jsonlite)
library(future)
library(future.apply)
library(RCurl)
library(magick)
library(taxize)
library(foreach)
library(doParallel)


#d<-read.table("https://data.canadensys.net/downloads/vascan/TXT-5bfd1205-26cd-4ee9-aada-af09bc88732a.txt",header=TRUE,encoding="UTF-8",sep="/t",nrows=10)

#d<-fread("https://data.canadensys.net/downloads/vascan/TXT-5bfd1205-26cd-4ee9-aada-af09bc88732a.txt",header=TRUE,encoding="UTF-8")


lf<-list.files("C:/Users/God/Downloads/vascan",full=TRUE,pattern=".txt")

taxon<-fread(grep("taxon",lf,value=TRUE))

distribution<-fread(grep("distribution",lf,value=TRUE))
distribution<-distribution[locality=="Québec",]

vernacular<-fread(grep("vernacularname",lf,value=TRUE))
vernacular<-vernacular[language=="FR" & isPreferredName,]


d<-fread("C:/Users/God/Downloads/vascan.csv",header=TRUE,encoding="UTF-8")
d<-d[d$Rang=="Espèce",]
d[,taxonID:=as.integer(basename(URL))]


d<-d[taxon,on="taxonID", nomatch=NULL]

d<-d[family%in%c("Poaceae","Cyperaceae","Juncaceae"),]

d<-merge(d,distribution,all.x=TRUE,by="taxonID")
#d<-d[distribution,,on="taxonID", nomatch=NA] # bug here!!!!!!!!
#d<-d[vernacular,,on="taxonID", nomatch=NA]
d<-merge(d,vernacular,all.x=TRUE,by="taxonID")


#i<-"Equisetum pratense"
#x<-fromJSON(paste0("https://api.inaturalist.org/v1/taxa?q=\"",gsub(" ","%20",i),"\""))$results$id[1]






### get inat ids from checklistbank.org
url<-"https://api.checklistbank.org/dataset/2012/nameusage/"
species<-unique(d$taxonID)#[1:100]
l<-lapply(species,function(i){
  print(match(i,species))
  x<-fromJSON(paste0(url,d$taxonID[match(i,d$taxonID)],"/related?datasetKey=139831"))
  if(length(x)>0){
    k<-x$status=="accepted"
    if(any(k)){
      sp<-unique(x$name[k,])
    }else{
      sp<-unique(x$name)
    }
    g<-grep(" × ",sp$scientificName)
    if(length(g)>0 && nrow(sp)>1){
      sp<-sp[-g,]
    }
    sp$id
  }else{
    NA
  }
})
names(l)<-species
species[sapply(l,length)==0]
species[sapply(l,length)==2]

inatnames<-data.table(taxonID=species,inatID=unlist(l,use.names=FALSE))
#d<-merge(d,inatnames,all.x=TRUE)
#inat$cbnm<-inat$taxref
#inat$cbnm<-gsub("var. |subsp. ","",inat$cbnm)

d$species<-d$`Nom scientifique`


### FNA links
d$fna<-paste0("http://floranorthamerica.org/",gsub(" ","_",d$species))
links<-unique(d$fna)
plan(multisession,workers=8)
ex<-future_lapply(links,url.exists)
plan(sequential)
d$fna<-ifelse(unlist(ex)[match(d$fna,links)],d$fna,NA)



### iNat links
inat<-basename(d$inatID)
d$inat<-ifelse(inat=="",NA,paste0("https://www.inaturalist.org/observations?subview=grid&place_id=13336&taxon_id=",inat))


### POWO links
sp<-d$species
powo<-get_pow(sp,ask=TRUE,accepted=TRUE,rank_filter="species")
powourl<-data.frame(sp=sp,powo=attributes(powo)$uri)
d$powo<-powourl$powo[match(d$species,powourl$sp)]


### VASCAN links
im<-image_read("https://layout.canadensys.net/common/images/favicon.ico")
image_write(image_trim(im[6]),"C:/Users/God/Documents/floreqc/vascanlogo.jpg")
d$vascan<-d$references


### GBIF links
sp<-d$species
if(length(sp)){
  registerDoParallel(detectCores())
  keys<-foreach(i=sp,.packages=c("rgbif")) %dopar% {
    #sptab<-rev(sort(table(as.data.frame(occ_search(scientificName=i,limit=200)$data)$scientificName)))
    #spfull<-names(sptab)[1]
    #key<-as.data.frame(name_suggest(q=spfull)$data)$key[1]
    key<-as.data.frame(name_backbone(name=i, rank='species', kingdom='plants'))$usageKey[1]
    file.path("https://www.gbif.org/fr/species",key)
  }
  gbifurl<-data.frame(sp=sp,gbif=unlist(keys))
  d$gbif<-gbifurl$gbif[match(d$species,gbifurl$sp)]
}


#fwrite(d,"C:/Users/God/Downloads/poales.csv")
d<-fread("C:/Users/God/Downloads/poales.csv")


iders<-paste(c("frousseu","elacroix-carignan","lysandra","marc_aurele","elbourret","bickel","michael_oldham","wdvanhem","sedgequeen","hsteger","seanblaney","bird_bugs_botany","chasseurdeplantes","bachandy","paquette0747","brothernorbert"),collapse="0%2C")

get_photos<-function(id,license=c("cc0","cc-by","cc-by-nc"),iders=""){
  #sp<-gsub(" ","%20",species)
  cc<-paste(license,collapse="0%2C")
  #urlsearch<-paste0("https://api.inaturalist.org/v1/taxa?q=",sp,"&order=desc&order_by=observations_count")
  #x<-fromJSON(urlsearch)$results
  x<-fromJSON(paste0("https://api.inaturalist.org/v1/observations?photo_license=",cc,"&taxon_id=",id,"&quality_grade=research&ident_user_id=",iders,"&order=desc&order_by=created_at"))
  if(x$total_results==0){
    return(NULL)
  }else{
    x<-x$results
  }
  users<-cbind(place_guess=x$place_guess,x$user[,c("login","name")])
  pics<-do.call("rbind",lapply(seq_along(x$observation_photos),function(i){
    res1<-x$observation_photos[[i]]$photo[,c("url","license_code","attribution")]
    res2<-x$observation_photos[[i]]$photo$original_dimensions[,c("width","height")]
    res<-cbind(res1,res2)
    #res<-res[which(res$width>205 & res$height>205),]
    #if(nrow(res)>0){
    res<-res[1,] # keep first one
    #}
    cbind(idobs=x$id[i],res,users[rep(i,nrow(res)),])
  }))
  #ids<-x$identifications[[1]][,c("taxon_id","current","user")]
  pics$url<-gsub("/square","/medium",pics$url)
  pics<-pics[which(pics$width>205 & pics$height>205),]
  pics
}

set.seed(1234)
ids<-sample(basename(d$inatID[d$inatID!=""]),100)
photos<-lapply(seq_along(ids),function(i){
  cat(paste(i,"\r"));flush.console()
  if(i==""){
    pic<-""
  }else{
    x<-get_photos(id=ids[i],iders=iders)
    if(is.null(x)){
      pic<-NULL
    }else{
      pic<-x[1:min(c(8,nrow(x))),]
    }
  }
  Sys.sleep(1)
  pic
})
photos<-lapply(seq_along(photos),function(i){
  if(is.null(photos[[i]])){
    cbind(idtaxa=ids[[i]],photos[[which(!sapply(photos,is.null))[1]]][0,][1,])
  }else{
    cbind(idtaxa=ids[[i]],photos[[i]])
  }
})
photos<-rbindlist(photos)


d[,idtaxa:=basename(inatID)]
d[,species:=d$"Nom scientifique"]
#pics<-data.frame(id=ids,pics=photos)
photos<-merge(photos,d,by.x="idtaxa",by.y="idtaxa",all.x=TRUE)
pics<-photos[order(species),]

pics<-pics[!duplicated(species),]
pics<-pics[!is.na(pics$url),]


#fwrite(pics,"C:/Users/God/Downloads/pics.csv")
#fread("C:/Users/God/Downloads/pics.csv")

#image_container<-function(species,url){
#  cat("\014")
#  invisible(lapply(seq_along(species),function(i){
#    cat(paste0("
#      <div class=\"image-container\">
#        <img class=\"image\" src=\"",url[i],"\" alt=\"Additional Image 8\">
#        <div class=\"image-title\">",species[i],"</div>
#      </div>
#    "))
#  }))
#}
#image_container(pics$species,pics$url)

image_array<-function(){
  #cat("\014")
  l<-sapply(1:nrow(pics),function(i){
    tags<-c("src","alt","famille","genre","espèce","fna","inat","vascan","gbif","powo","class","ordre")
    tagnames<-c("url","species","family","genus","species","fna","inat","vascan","gbif","powo","class","order")
    info<-unlist(as.vector(pics[i,..tagnames]))
    info<-unname(sapply(info,function(x){paste0("\"",x,"\"")}))
    w<-which(photos$species==pics$species[i])
    urls<-photos$url[w][1:(min(c(length(w),8)))]
    urls<-paste0("[ \"",paste(urls,collapse="\", \""),"\" ]")
    tags<-c(tags,"images")
    info<-c(info,urls)

    urls<-photos$attribution[w][1:(min(c(length(w),8)))]
    urls<-paste0("[ \"",paste(urls,collapse="\", \""),"\" ]")
    tags<-c(tags,"credit")
    info<-c(info,urls)

    urls<-photos$idobs[w][1:(min(c(length(w),8)))]
    urls<-paste0("https://www.inaturalist.org/observations/",urls)
    urls<-paste0("[ \"",paste(urls,collapse="\", \""),"\" ]")
    tags<-c(tags,"link")
    info<-c(info,urls)


    arr<-paste("{",paste0(paste0(tags,": ",info),collapse=", "),"},",collapse="")
    #arr<-gsub("\"{","{",arr)
    #arr<-gsub("}\"","}",arr)
    #cat(arr,"\n")
    arr
    #write(paste("const = [",arr,"];"),file="data.js",append=TRUE)
  })
  arr<-paste(l,collapse=" ")
  write(paste("const data = [",arr,"];"),file="data.js",append=TRUE)
}

option_values<-function(x,tag,append=TRUE){
  #cat("\014")
  values<-sort(unique(x[[tag]]))
  write(paste0("const ",paste0(tag,"_values")," = [\"",paste0(values,collapse="\", \""),"\"];"),file="data.js",append=append)
}
option_values(pics,tag="family",append=FALSE)
option_values(pics,tag="genus")
option_values(pics,tag="species")
image_array()





x<-x[grep("QC\\, Canada|Québec\\, Canada",x$place_guess),]


library(wordcloud2)

df<-as.data.frame(table(d[d$family!="As",]$genus))
df<-df[rev(order(df$Freq)),]
row.names(df)<-df[,1]
wordcloud2(data=df, size=0.75, shape="square",color='random-dark',minSize=1)


