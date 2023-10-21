
library(data.table)
library(magick)
library(sf)
library(terra)
library(rmapshaper)
library(geodata)
library(magick)
library(berryFunctions)


###
d<-fread("C:/Users/God/Downloads/0021817-231002084531237/0021817-231002084531237.csv")
d[,date:=eventDate]
d[,jul:=as.integer(format(as.Date(date),"%j"))]
d[,year:=substr(date,1,4)]

dates<-format(as.Date(1:365)-1,"%Y-%m-%d")
brks<-as.integer(format(as.Date(dates[c(which(substr(dates,9,10)%in%c("01")),365)]),"%j"))
brks<-sort(c(brks,brks[-length(brks)]+diff(brks)/2))


h<-hist(d[species=="Trillium erectum","jul",]$jul,breaks=brks)
#plot(density(d$jul,na.rm=TRUE))
pheno<-density(d$jul,na.rm=TRUE,adjust=3,from=1,to=365)
#h<-lapply(h,"[",c(5:25))
labs<-gsub("\\.","",format(as.Date(h$mids),"%b"))

png("C:/Users/God/Documents/floreqc/qcflorepheno.png",units="cm",width=9,height=5,res=300)
par(mar=c(3,2,0.5,0.5))

plot(0,0,xlim=c(60,335),ylim=c(0,max(c(5,h$counts))*1.01),type="n",xaxt="n",yaxt="n",xaxs = 'i',yaxs = 'i',axes=FALSE)
abline(v=brks,lty=3,col="grey80")
abline(h=pretty(h$counts),lty=3,col="grey80")
invisible(lapply(seq_along(h$counts),function(i){
  offset<-0.75
  roundedRect(xleft=brks[i]+offset,xright=brks[i+1]-offset,ybottom=0,ytop=h$counts[i],col="forestgreen",border=NA,corners=c(2,3),rounding=0.15)
}))
alongx<-pheno$x
alongy<-(pheno$y/max(pheno$y))*max(h$counts)
polygon(c(alongx,rev(alongx)),c(alongy,rep(0,length(alongy))),col=adjustcolor("darkgreen",0.15),border=NA)
lines(alongx,alongy,col=adjustcolor("darkgreen",0.35))
#invisible(lapply(seq_along(h$counts),function(i){
#  offset<-0.75
#  roundedRect(xleft=brks[i]+offset,xright=brks[i+1]-offset,ybottom=0,ytop=h$counts[i],col=adjustcolor("forestgreen",0.25),border=NA,corners=c(2,3),rounding=0.15)
#}))
months<-brks[seq(2,length(brks),by=2)]
minus<--c(1,2,length(months))
months<-months[minus]
monthlims<-brks[-seq(2,length(brks),by=2)]
monthlims<-monthlims[-c(1:2)]
text(months,rep(0,length(months)),label=unique(labs)[minus],srt=0,adj=c(0.5,1.5),cex=0.65,xpd=TRUE)
axis(1,at=monthlims,labels=rep("",length(monthlims)),tcl=-0.6,lwd=0,lwd.ticks=1,col.ticks="grey80",xpd=TRUE)
mtext(side=2,line=1,font=2,text="Nb d'observations",cex=0.75)
axis(2,at=pretty(h$counts)[-1],mgp=c(2,0.05,0),tcl=0,las=2,col="grey50",cex.axis=0.5,lwd=0)

dev.off()
image_read("C:/Users/God/Documents/floreqc/qcflorepheno.png") |> image_trim() |> image_border("10x10",color="white") |> image_write("C:/Users/God/Documents/floreqc/qcflorepheno.png")
file.show("C:/Users/God/Documents/floreqc/qcflorepheno.png")
















