
library(geodata)
library(sf)
library(rmapshaper)
library(rnaturalearth)
library(magick)
library(foreach)
library(doParallel)

gbif<-fread("C:/Users/God/Downloads/0021817-231002084531237/0021817-231002084531237.csv")
gbif<-st_as_sf(gbif,coords=c("decimalLongitude","decimalLatitude"),crs=4326)
gbif<-st_transform(gbif,32618)

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

bbox<-st_bbox(region)
bbox[4]<-5700000

south<-st_crop(st_intersection(region,lakes),bbox)

sp<-sample(unique(d$species[d$species%in%gbif$species]))


cl<-makeCluster(6)
registerDoParallel(cl)
foreach(i=sp,.packages=c("sf","terra","magick")) %dopar% {
  print(i)

  plotQC<-function(region,ylim=NULL,cex=0.3){ # plotting function for the study area
    par(mar=c(0,0,0,0))
    #plot(st_geometry(qc),col="grey99",border=NA)
    plot(st_geometry(region),lwd=0.1,col="grey85",border="grey60",ylim=ylim)
    plot(st_geometry(lakes),col="grey99",border="grey75",lwd=0.05,add=TRUE)
    plot(st_geometry(x),pch=21,bg=adjustcolor("forestgreen",0.5),col=adjustcolor("forestgreen",0.9),lwd=0.3,cex=cex,add=TRUE)
  }


  x<-gbif[gbif$species==i,]
  path<-paste0("C:/Users/God/Documents/floreqc/images/",gsub(" ","_",i),"_map.png")
  png(gsub("_map","_map1",path),units="cm",width=3,height=1.5,res=500)
  plotQC(region,ylim=lim)
  dev.off()
  image_read(gsub("_map","_map1",path)) |> image_trim() |> image_border("x20",color="white") |> image_write(gsub("_map","_map1",path))
  #file.show("C:/Users/God/Documents/floreqc/qcfloremap1.png")

  png(gsub("_map","_map2",path),units="cm",width=3,height=1.5,res=500)
  plotQC(region,ylim=NULL,cex=0.3)
  dev.off()
  image_read(gsub("_map","_map2",path)) |> image_trim() |> image_write(gsub("_map","_map2",path))

  im1<-image_read(gsub("_map","_map1",path))
  im2<-image_read(gsub("_map","_map2",path))
  im<-image_composite(im1,image_scale(im2,"x140"),offset="+10+0",gravity="southeast")
  im |> image_trim() |> image_write(path)
}
stopCluster(cl)
file.show(list.files(dirname(path),full=TRUE,pattern="_map.png")[1])

