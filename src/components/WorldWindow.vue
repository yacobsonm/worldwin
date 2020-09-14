<template>
    <v-layout>
    <world-window-controller @toggleLayerVisibility="toggleLayerVisibility"/>

    <canvas id="canvasOne" width="1024" height="768"
                @dblclick="onDblClick"
                @mousedown="onMouseDown"
                @mouseup="onMouseUp"
                @mousemove="onMouseMove"
                @drop="onDrop"
                @dragover="onDragOver"
        />
        <annotation-editor :evt="showEditorEvent"
                           @updateAnnotation="updateAnnotation"
                           @deleteAnnotation="deleteAnnotation"
        />
    </v-layout>
</template>

<script>
    /* global WorldWind */ //  need this external definition for vue to compile

import WorldWindowController from '@/components/WorldWindowController'
import AnnotationEditor from "@/components/AnnotationEditor";

export default {
    name: "WorldWindow",

    data: () => (
        {
            wwd: null,
            layers: {},
            icons: {},
            currentAnnotation: undefined,
            showEditorEvent: undefined
        }
    ),
    components: {
        WorldWindowController,
        AnnotationEditor
    },

    methods: {
        toggleLayerVisibility(name) {
            this.layers[name].enabled = !this.layers[name].enabled;
            this.wwd.redraw();
        },

        updateAnnotation(evt, text) {
            const terrain = this.findObject(evt, true);
            if (terrain) {
                this.addAnnotation(text, terrain.position);
                this.wwd.redraw();
            }
        },
        deleteAnnotation() {},


        onDblClick(evt) {
            const obj = this.findObject(evt);
            if (obj && obj.userProperties.type === 'Annotation') {
                this.showEditorEvent = {annotation: obj, event: evt};
            }
        },

        onMouseDown(evt) {
            const obj = this.findObject(evt);
            if (obj && obj.userProperties.type === 'Annotation') {
                this.wwd.addEventListener('pointermove', this.onPointerMove);
                this.currentAnnotation = obj;
            }
        },

        onMouseMove(evt) {
            if (this.currentAnnotation) {
                const terrain = this.findObject(evt, true);
                if (terrain) {
                    Object.assign(this.currentAnnotation.position, terrain.position);
                    this.wwd.redraw();
                }
            }
        },

        onMouseUp() {
            if (this.currentAnnotation) {
                this.currentAnnotation = undefined;
                this.wwd.removeEventListener('pointermove' , this.onPointerMove);
            }
        },
        onDragOver(evt) {
            evt.preventDefault();
        },

        onDrop(evt) {
            this.showEditorEvent = {annotation: {}, event: evt};

        },

        onPointerMove(evt) { // disable globe rotation
            evt.preventDefault();
        },

        findObject(evt, getTerrain) {
            const x = evt.clientX,
                y = evt.clientY;

            if (getTerrain) {
                const pickList = this.wwd.pickTerrain(this.wwd.canvasCoordinates(evt.clientX, evt.clientY));
                // Terrain should be one of the items if the globe was clicked
                const terrain = pickList.terrainObject();
                if (terrain) {
                    return terrain;
                }
            } else {
                const pickList = this.wwd.pick(this.wwd.canvasCoordinates(x, y));
                if (pickList.objects.length > 0) {
                    for (let i=0; i<pickList.objects.length; i++) {
                        let obj = pickList.objects[i];
                        if (!obj.isTerrain) {
                            // obj.userObject.highlighted = true;
                            return obj.userObject;
                        }
                    }
                }
            }
            return null;
        },

        addStore(type, name, icon, coordinates)  {
            const placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

            placemarkAttributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.3,
                WorldWind.OFFSET_FRACTION, 0.0);

            placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
            placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);

            placemarkAttributes.imageSource = icon;

            const position = new WorldWind.Position(coordinates.latitude, coordinates.longitude, 100.0);
            const placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

            placemark.label = name;
            placemark.targetVisibility = 0;
            placemark.alwaysOnTop = true;
            placemark.userProperties = {type: type, name: name};

            this.layers[type].addRenderable(placemark);
        },

        addAnnotation(text, coordinates) {
            // Set default annotation attributes.
            const annotationAttributes = new WorldWind.AnnotationAttributes(null);
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
            const location = new WorldWind.Position(coordinates.latitude, coordinates.longitude, 3000.0);

            // var location = new WorldWind.Position(40.964231, -103.627767, 1e2);
            const annotation = new WorldWind.Annotation(location, annotationAttributes);
            // Text can be assigned to the annotation after creating it.
            annotation.label = text;

            annotation.userProperties = {type: 'Annotation'};
            this.layers['Annotations'].addRenderable(annotation);

        },

        populateStores(type, count, startPoint) {
            // add Walmart stores
            for (let i=0; i<count; i++) {
                let coords = {
                    latitude: startPoint.latitude + Math.random() * 20,
                    longitude: startPoint.longitude + Math.random() * 20
                }
                this.addStore(type, type + ' ' +i, this.icons[type], coords);
            }
        }
    },

    mounted() {
        this.wwd = new WorldWind.WorldWindow("canvasOne");
        this.wwd.addLayer(new WorldWind.BMNGOneImageLayer());
        this.wwd.addLayer(new WorldWind.BMNGLandsatLayer());

        this.layers["Walmart"] = new WorldWind.RenderableLayer("Walmart");
        this.layers["Target"] = new WorldWind.RenderableLayer("Target");
        this.layers["Annotations"] = new WorldWind.RenderableLayer("Annotations");

        this.icons["Walmart"] = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";
        this.icons["Target"] = WorldWind.configuration.baseUrl + "images/pushpins/plain-blue.png";

        Object.values(this.layers).forEach((layer) => {
            this.wwd.addLayer(layer)
        });

        this.populateStores("Walmart", 10, {latitude: 40, longitude: -110});
        this.populateStores("Target", 10, {latitude: 30, longitude: -120});

    }
}


</script>

<style scoped>

</style>