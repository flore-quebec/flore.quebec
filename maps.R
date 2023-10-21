
library(geodata)
library(sf)
library(rmapshaper)
library(rnaturalearth)
library(magick)

d<-fread("C:/Users/God/Downloads/0021817-231002084531237/0021817-231002084531237.csv")
d<-st_as_sf(d,coords=c("decimalLongitude","decimalLatitude"),crs=4326)
d<-st_transform(d,32618)

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

# Add it to the study region
region<-rbind(region,labrador)

# Simplify polygons to make things faster
region<-ms_simplify(region,0.02)
region<-st_union(region) |> st_as_sf()

# lakes
lakes<-ne_download(scale="large",type="lakes",destdir=getwd(),category="physical",returnclass="sf") |> st_transform(32618)
#lakes<-ne_download(scale="large",type="rivers_lake_centerlines",destdir=getwd(),category="physical",returnclass="sf") |> st_transform(32618)
lakes<-st_filter(lakes,region)
lakes<-ms_simplify(lakes,0.05)
lakes<-st_intersection(lakes,region)

lim<-c(min(st_bbox(region)[c(2,4)]),5700000)



sp<-"Trillium cernuum"
x<-d[d$species==sp,]

plotQC<-function(ylim=NULL,cex=0.2){ # plotting function for the study area
  par(mar=c(0,0,0,0))
  #plot(st_geometry(qc),col="grey99",border=NA)
  plot(st_geometry(region),lwd=0.1,col="grey85",border="grey60",ylim=ylim)
  plot(st_geometry(lakes),col="grey99",border="grey75",lwd=0.05,add=TRUE)
  plot(st_geometry(x),pch=21,bg=adjustcolor("forestgreen",0.5),col=adjustcolor("forestgreen",0.9),lwd=0.3,cex=cex,add=TRUE)
}
png("C:/Users/God/Documents/floreqc/qcfloremap1.png",units="cm",width=3,height=1.5,res=500)
plotQC(ylim=lim)
dev.off()
image_read("C:/Users/God/Documents/floreqc/qcfloremap1.png") |> image_trim() |> image_border("x20",color="white") |> image_write("C:/Users/God/Documents/floreqc/qcfloremap1.png")
#file.show("C:/Users/God/Documents/floreqc/qcfloremap1.png")

png("C:/Users/God/Documents/floreqc/qcfloremap2.png",units="cm",width=3,height=1.5,res=500)
plotQC(ylim=NULL,cex=0.3)
dev.off()
image_read("C:/Users/God/Documents/floreqc/qcfloremap2.png") |> image_trim() |> image_write("C:/Users/God/Documents/floreqc/qcfloremap2.png")

im1<-image_read("C:/Users/God/Documents/floreqc/qcfloremap1.png")
im2<-image_read("C:/Users/God/Documents/floreqc/qcfloremap2.png")
im<-image_composite(im1,image_scale(im2,"x140"),offset="+10+0",gravity="southeast")
im |> image_trim() |> image_write("C:/Users/God/Documents/floreqc/qcfloremap.png")
file.show("C:/Users/God/Documents/floreqc/qcfloremap.png")

