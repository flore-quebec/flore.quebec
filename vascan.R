
library(data.table)
library(jsonlite)

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



#fwrite(d,"C:/Users/God/Downloads/poales.csv")
d<-fread("C:/Users/God/Downloads/poales.csv")



iders<-paste(c("frousseu","elacroix-carignan","lysandra","marc_aurele","elbourret","bickel","michael_oldham","wdvanhem","sedgequeen","hsteger","seanblaney"),collapse="0%2C")

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

ids<-sample(basename(d$inatID[d$inatID!=""]),200)
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
  Sys.sleep(0.5)
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
fread(pics,"C:/Users/God/Downloads/pics.csv")

image_container<-function(species,url){
  cat("\014")
  invisible(lapply(seq_along(species),function(i){
    cat(paste0("
      <div class=\"image-container\">
        <img class=\"image\" src=\"",url[i],"\" alt=\"Additional Image 8\">
        <div class=\"image-title\">",species[i],"</div>
      </div>
    "))
  }))
}
image_container(pics$species,pics$url)

image_array<-function(){
  cat("\014")
  invisible(lapply(1:nrow(pics),function(i){
    tags<-c("src","alt","famille","genre","espèce")
    tagnames<-c("url","species","family","genus","species")
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

    arr<-paste("{",paste0(paste0(tags,": ",info),collapse=", "),"},",collapse="")
    #arr<-gsub("\"{","{",arr)
    #arr<-gsub("}\"","}",arr)
    cat(arr,"\n")
  }))
}
image_array()

option_values<-function(x,tag){
  cat("\014")
  values<-sort(unique(x[[tag]]))
  cat(paste0("<option value=\"",values,"\">\n"))
}
option_values(pics,tag="species")
option_values(pics,tag="genus")




x<-x[grep("QC\\, Canada|Québec\\, Canada",x$place_guess),]


library(wordcloud2)

df<-as.data.frame(table(d[d$family!="As",]$genus))
df<-df[rev(order(df$Freq)),]
row.names(df)<-df[,1]
wordcloud2(data=df, size=0.75, shape="square",color='random-dark',minSize=1)



library(geodata)
library(sf)
library(rmapshaper)
library(rnaturalearth)

can<-gadm("CAN",path="C:/Users/God/Downloads/qc.gpkg") |> st_as_sf()

# Downloads polygons using package geodata
#can<-gadm("CAN",level=1,path=getwd()) |> st_as_sf()
can<-st_transform(can,32618)

# keep Québec and bordering provinces/states as a buffer
region<-can[can$NAME_1%in%c("Québec"),]

# split NF into different polygons
labrador<-ms_explode(can[can$NAME_1%in%c("Newfoundland and Labrador"),])
labrador<-labrador[which.max(st_area(labrador)),] # keep Labarador
region<-rbind(region,labrador)
qc<-ms_simplify(region,0.01)

# Add it to the study region
region<-rbind(region,labrador)

# Simplify polygons to make things faster
region<-ms_simplify(region,0.01)
region<-st_union(region) |> st_as_sf()

# lakes
lakes<-ne_download(scale="large",type="lakes",destdir=getwd(),category="physical",returnclass="sf") |> st_transform(32618)
#lakes<-ne_download(scale="large",type="rivers_lake_centerlines",destdir=getwd(),category="physical",returnclass="sf") |> st_transform(32618)
lakes<-st_filter(lakes,region)
lakes<-ms_simplify(lakes,0.05)
lakes<-st_intersection(lakes,region)


plotQC<-function(){ # plotting function for the study area
  par(mar=c(0,0,0,0))
  plot(st_geometry(qc),col="grey99",border=NA)
  plot(st_geometry(region),lwd=0.1,col="grey85",border="grey50",add=TRUE)
  plot(st_geometry(lakes),col="grey99",border="grey75",lwd=0.05,add=TRUE)
  plot(st_sample(region,50),pch=21,bg=adjustcolor("forestgreen",0.5),col=adjustcolor("forestgreen",0.9),lwd=0.3,cex=0.2,add=TRUE)
}
png("C:/Users/God/Documents/floreqc/qcfloremap.png",units="cm",width=3,height=3,res=500)
plotQC()
dev.off()
image_read("C:/Users/God/Documents/floreqc/qcfloremap.png") |> image_trim() |> image_border("10x10",color="white") |> image_write("C:/Users/God/Documents/floreqc/qcfloremap.png")
file.show("C:/Users/God/Documents/floreqc/qcfloremap.png")


library(data.table)
library(magick)
d<-fread("C:/Users/God/Documents/UdeS/Téléchargements/iNatQC.csv")
d[,jul:=as.integer(format(as.Date(observed_on),"%j"))]
d[,year:=substr(observed_on,1,4)]

dates<-format(as.Date(90:300)-1,"%Y-%m-%d")
brks<-as.integer(format(as.Date(dates[which(substr(dates,9,10)%in%c("01","15"))]),"%j"))
h<-hist(d[taxon_species_name=="Trillium erectum","jul",]$jul,breaks=brks)
labs<-format(as.Date(h$mids),"%b-%d")

png("C:/Users/God/Documents/floreqc/qcflorepheno.png",units="cm",width=10,height=5,res=300)
par(mar=c(3,3,0.5,0.5))
b<-barplot(h$counts,names.arg="",las=2,col="forestgreen",border=NA,space=0.05,yaxt="n",xaxt="n")
text(b[,1],rep(0,nrow(b)),label=labs,srt=90,adj=c(1.2,0.5),cex=0.5,xpd=TRUE)
axis(2,mgp=c(2,0.25,0),tcl=-0.1,las=2,col="grey50",cex.axis=0.5)
box(col="grey99",lwd=3)
mtext(side=2,line=1,font=2,text="Nb d'observations",cex=0.75)
abline(v=b[,1],lty=3,col="grey80")
abline(h=pretty(h$counts),lty=3,col="grey80")
par(new=TRUE)
par(mar=c(3,3,0.5,0.5))
b<-barplot(h$counts,names.arg="",las=2,col="forestgreen",border=NA,space=0.05,yaxt="n")
par(new=FALSE)
dev.off()
image_read("C:/Users/God/Documents/floreqc/qcflorepheno.png") |> image_trim() |> image_border("10x10",color="white") |> image_write("C:/Users/God/Documents/floreqc/qcflorepheno.png")
file.show("C:/Users/God/Documents/floreqc/qcflorepheno.png")




