<template>

  <div>
    <div draggable="true"  style="width: 20px; height: 20px; background: #2c3e50"

    ></div>

    <button @click="hide">Hide</button>
    <canvas id="canvasOne" width="1024" height="768"
            @dblclick="onClick"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
            @drop="onDrop"
    >
      <!--
      @onmousedown="onMouseDown"
            @onmouseup="onMouseUp"
            @onmousemove="onMouseMove"
            @dragenter="ondragEnter"
      -->
    </canvas>
  </div>
</template>

<script >
  /* global WorldWind */
let count = 0;
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: () => (
    {
      wwd: null,
      storesLayer: null
    }
  ),

  methods: {
    hide() {
        this.storesLayer.enabled = !this.storesLayer.enabled;
        // this.storesLayer.refresh();
    },

    onMouseDown(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!count)
      this.wwd.addEventListener('pointermove', this.onPointerMove);
      console.log("MOUSE DOWN")
    },
    onPointerMove(evt) {
      evt.preventDefault();
      count++;
    },

    onMouseUp(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.wwd.removeEventListener('pointermove' , this.onPointerMove)
      console.log("MOUSE UP")
    },
    onMouseMove(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      console.log("MOUSE Move")
    },

    onClick(evt) {
      let x = evt.clientX,
          y = evt.clientY;

      let pickList = this.wwd.pick(this.wwd.canvasCoordinates(x, y));
      if (pickList.objects.length > 0) {
        console.log("SELECTED: ", pickList.objects)
        for (let i=0; i<pickList.objects.length; i++) {
          let obj = pickList.objects[i];
          if (!obj.isTerrain) {
            obj.userObject.highlighted = true;
            console.log("PROP:", obj.userObject.userProperties.name)
          }
        }
      }
    },

    onDrop(evt) {
      console.log("++ondrop",evt)
    },
    ondragEnter(evt) {
      console.log("ondragEnter",evt)
    }

  },

  mounted() {
    this.wwd = new WorldWind.WorldWindow("canvasOne");

    // this.wwd.addEventListener('pointermove', (evt) => {
    //   evt.preventDefault();
    // });
    // this.wwd.addEventListener("dragover", (evt) => {
    //   evt.preventDefault();
    // });
    //
    // this.wwd.addEventListener("drop", (evt) => {
    //   evt.preventDefault();
    //   console.log("!!!")
    // });


    // this.wwd.addEventListener("mousedown", this.onMouseDown);
    // this.wwd.addEventListener("mousemove", this.onMouseMove);

    this.wwd.addLayer(new WorldWind.BMNGOneImageLayer());
    this.wwd.addLayer(new WorldWind.BMNGLandsatLayer());
    //
    // this.wwd.addLayer(new WorldWind.CompassLayer());
    // this.wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(this.wwd));
    // this.wwd.addLayer(new WorldWind.ViewControlsLayer(this.wwd));

    // placemarks

    var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
    this. storesLayer = new WorldWind.RenderableLayer("Stores");

    this.wwd.addLayer(placemarkLayer);
    this.wwd.addLayer(this.storesLayer);

    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

    placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);

    placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);

    // placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";
    placemarkAttributes.imageSource = "https://files.worldwind.arc.nasa.gov/artifactory/web/0.9.0/images/pushpins/castshadow-black.png";

    var position = new WorldWind.Position(55.0, -106.0, 100.0);
    var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

    placemark.label = "Placemark\n" +
            "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
            "Lon " + placemark.position.longitude.toPrecision(5).toString();
    placemark.alwaysOnTop = true;
    placemark.userProperties = {name: 'Target'};

    // placemark.targetVisibility = 0.2;
    placemarkLayer.addRenderable(placemark);
    //----------------------------------------------

    var sAttributes = new WorldWind.PlacemarkAttributes(null);

    sAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);

    sAttributes.labelAttributes.color = WorldWind.Color.RED;
    sAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);

    sAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";
    // sAttributes.imageSource = "https://files.worldwind.arc.nasa.gov/artifactory/web/0.9.0/images/pushpins/castshadow-black.png";

    position = new WorldWind.Position(50.0, -107.0, 100.0);
    placemark = new WorldWind.Placemark(position, false, sAttributes);

    placemark.label = "Placemark\n" +
            "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
            "Lon " + placemark.position.longitude.toPrecision(5).toString();
    placemark.alwaysOnTop = true;
    placemark.userProperties = {name: 'Walmart'};

    // let highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
    // highlightAttributes.imageScale = 1.2;
    // placemark.highlightAttributes = highlightAttributes;

    // placemark.targetVisibility = 0.2;
    this.storesLayer.addRenderable(placemark);

    // setTimeout(() => {
    //   placemark.position = new WorldWind.Position(40.0, -107.0, 100.0);
    //   this.wwd.redraw()
    // }, 3000)

    //---------------------------------------------
    // Set default annotation attributes.
    var annotationAttributes = new WorldWind.AnnotationAttributes(null);
    annotationAttributes.cornerRadius = 14;
    annotationAttributes.backgroundColor = WorldWind.Color.BLUE;
    annotationAttributes.drawLeader = true;
    annotationAttributes.leaderGapWidth = 40;
    annotationAttributes.leaderGapHeight = 30;
    annotationAttributes.opacity = 1;
    annotationAttributes.scale = 1;
    annotationAttributes.width = 200;
    annotationAttributes.height = 100;
    annotationAttributes.textAttributes.color = WorldWind.Color.WHITE;
    annotationAttributes.insets = new WorldWind.Insets(10, 10, 10, 10);

    // Set a location for the annotation to point to and create it.
    var location = new WorldWind.Position(40.964231, -103.627767, 1e2);
    var annotation = new WorldWind.Annotation(location, annotationAttributes);
    // Text can be assigned to the annotation after creating it.
    annotation.label = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";

    annotation.userProperties = {name: 'Annotation'};

    // Create and add the annotation layer to the WorldWindow's layer list.
    var annotationsLayer = new WorldWind.RenderableLayer("Annotations");
    annotationsLayer.addRenderable(annotation);
    this.wwd.addLayer(annotationsLayer);

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

</style>
