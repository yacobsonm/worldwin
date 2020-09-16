<template>
    <v-layout>
    <world-window-controller @toggleLayerVisibility="toggleLayerVisibility"/>

    <canvas id="canvasOne" width="1024" height="768"
                @dragover="onDragOver"
        />
        <annotation-editor :evt="showEditorEvent"
                           @updateAnnotation="updateAnnotation"
                           @deleteAnnotation="deleteAnnotation"
                           @close="annotationEditorClosed"
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
            lastHighlighted: undefined,
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

        updateAnnotation(evt, text, annotation) {
            this.currentAnnotation = undefined;

            if (annotation) {
                this.deleteAnnotation(annotation);
                this.addAnnotation(text, annotation.position);
                this.wwd.redraw();

            } else {
                const terrain = this.findObject(evt, true);
                if (terrain) {
                    this.addAnnotation(text, terrain.position);
                    this.wwd.redraw();
                    this.addListeners();
                }
            }
        },

        deleteAnnotation(annotation) {
            this.currentAnnotation = undefined;
            this.layers["Annotations"].removeRenderable(annotation);
            this.wwd.redraw();
            this.addListeners();
        },

        annotationEditorClosed() {
            this.currentAnnotation = undefined;
            this.addListeners();
        },

        onDblClick(evt) {
            this.currentAnnotation = undefined;

            const obj = this.findObject(evt);
            if (obj && obj.userProperties.type === 'Annotation') {
                this.removeListeners();
                this.currentAnnotation = obj;
                this.showEditorEvent = {event: evt, annotation: obj};
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
            let redraw = false;
            
            if (this.currentAnnotation) {
                const terrain = this.findObject(evt, true);
                if (terrain) {
                    Object.assign(this.currentAnnotation.position, terrain.position);
                    redraw = true;
                }
            }

            if (this.lastHighlighted) {
                this.lastHighlighted.targetVisibility = 0;
                redraw = true;
            }
            
            const obj = this.findObject(evt);
            if (obj && obj.type !== "Annotation") { // mouse on the store
                obj.targetVisibility = 1;
                this.lastHighlighted = obj;
                redraw = true;
            }
            if (redraw) {
                this.wwd.redraw();
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
            this.removeListeners();
            this.showEditorEvent = {event: evt};
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

        addAnnotation(text, position) {
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
            const annotation = new WorldWind.Annotation(position, annotationAttributes);
            // Text can be assigned to the annotation after creating it.
            annotation.label = text;

            annotation.userProperties = {type: 'Annotation'};
            this.layers['Annotations'].addRenderable(annotation);

            return annotation;

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
        },

        addListeners() {
            this.wwd.addEventListener('dblclick', this.onDblClick);
            this.wwd.addEventListener('mousedown', this.onMouseDown);
            this.wwd.addEventListener('mouseup', this.onMouseUp);
            this.wwd.addEventListener('mousemove', this.onMouseMove);
            this.wwd.addEventListener('drop', this.onDrop);
        },
        removeListeners() {
            this.wwd.removeEventListener('dblclick', this.onDblClick);
            this.wwd.removeEventListener('mousedown', this.onMouseDown);
            this.wwd.removeEventListener('mouseup', this.onMouseUp);
            this.wwd.removeEventListener('mousemove', this.onMouseMove);
            this.wwd.removeEventListener('drop', this.onDrop);
        }
    },

    mounted() {
        this.wwd = new WorldWind.WorldWindow("canvasOne");
        this.wwd.addLayer(new WorldWind.BMNGOneImageLayer());
        this.wwd.addLayer(new WorldWind.BMNGLandsatLayer());

        this.layers["Walmart"] = new WorldWind.RenderableLayer("Walmart");
        this.layers["Target"] = new WorldWind.RenderableLayer("Target");
        this.layers["Annotations"] = new WorldWind.RenderableLayer("Annotations");

        this.icons["Target"] = "icons/target.png";
        this.icons["Walmart"] = "icons/walmart.png";

        Object.values(this.layers).forEach((layer) => {
            this.wwd.addLayer(layer)
        });

        this.populateStores("Walmart", 10, {latitude: 40, longitude: -110});
        this.populateStores("Target", 10, {latitude: 30, longitude: -120});

        this.addListeners();

    }
}


</script>

<style scoped>

</style>