<template>
    <v-menu
            v-model="showEditor"
            absolute
            :close-on-content-click="false"
            :close-on-click="true"
            :position-x="event ? event.x : 0"
            :position-y="event ? event.y : 0"
            offset-y
            style="max-width: 600px;"
    >
        <v-card width="500">
            <v-card-text >
                <v-row >
                    <v-textarea v-model="text"
                          placeholder="Enter text"
                          hide-details
                          rows="3"
                          autofocus
                    />
                </v-row>
                <v-row >
                    <v-col cols="12" style="padding: 0">
                        <v-menu top nudge-right="100" min-width="10px" :close-on-content-click="false">
                            <template  v-slot:activator="{ on }">
                                <v-row  style="margin: 0;" justify="end">
                                    <v-col cols="4" v-on="on" @click="showColorPicker=true">
                                        <v-row class="color-box" justify="end">
                                            <h3 class="label">Background: </h3>
                                            <div class="box" :style="{background: annotation.backgroundColor}"/>
                                        </v-row>
                                    </v-col>
                                    <v-col/>
                                </v-row>
                            </template>

                            <v-color-picker v-if="showColorPicker"
                                            v-model="annotation.fill"
                                            hide-inputs
                                            elevation="15"
                            />
                        </v-menu>
                    </v-col>
                </v-row>


<!--
                <v-row style="margin-bottom: 0">
                    <v-col cols="12" style=" padding: 0">
                        <v-menu top nudge-right="100" min-width="10px" :close-on-content-click="false">
                            <template  v-slot:activator="{ on }">
                                <v-row  style="margin: 0; " justify="end">
                                    <v-col cols="4" v-on="on" @click="showBorderPicker=true">
                                        <v-row class="color-box" justify="end">
                                            <h3 class="label">Border: </h3>
                                            <div class="box" :style="{background: annotation.stroke}"/>
                                        </v-row>
                                    </v-col>

                                    <v-col>
                                        <v-row >
                                        <h3  style="width: 60px; padding-top: 8px; margin-left: 20px;">width: </h3>
                                        <div style="width: 70px; margin-top: -18px">
                                            <v-text-field  type="number"
                                                          v-model="annotation.strokeWidth"
                                                          hide-details
                                                          @change="annotation.strokeWidth=parseInt(annotation.strokeWidth)" />
                                        </div>

                                        </v-row>
                                    </v-col>
                                </v-row>
                            </template>

                            <v-color-picker v-if="showBorderPicker"
                                            v-model="annotation.stroke"
                                            hide-inputs
                                            elevation="15"
                            />
                        </v-menu>
                    </v-col>
                </v-row>
-->

            </v-card-text>
            <v-card-actions>
                <v-btn style="margin-left: 20px"  @click="deleteannotation">Delete</v-btn>

                <v-spacer/>
                <v-btn color="primary" @click="ok">Ok</v-btn>
                <v-btn style="margin-left: 20px"  @click="showEditor=false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        name: "AnnotationEditor",
        props: ["evt"],

        data: () => ({
            showEditor: false,
            showColorPicker: false,
            annotation: {},
            text: "",
            event: undefined,
            background: "",
            // x: 0,
            // y: 0,
            picker: null

        }),

        methods: {
            ok() {
                this.$emit('updateAnnotation', this.event, this.text);
                this.showEditor = false;

            },
            deleteannotation() {
                this.$emit('deleteAnnotation', this.annotation);
                this.showEditor = false;
            }
        },
        watch: {
            evt(newVal/*, oldVal*/) {
                if (newVal) {
                    this.showEditor = true;
                    this.event = newVal.event;

                    // this.x = newVal.event.x;
                    // this.y = newVal.event.y;
                    this.text = newVal.annotation.text;

                    //this.annotation = /*Object.assign({},*/ newVal.annotation/*)*/;


                    // if (this.annotation.backgroundColor === undefined) {
                    //     this.annotation.backgroundColor = "#ffffffff";
                    // }
                    // if (this.annotation.textAttributes && this.annotation.textAttributes.color === undefined) {
                    //     this.annotation.textAttributes.color = "black";
                    // }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .color-box {
        cursor: pointer;
        .label {
            margin-top: 8px;
            margin-right: 8px;
        }
        .box {
            height: 30px;
            width: 30px;
            border: solid 1px black;
            border-radius: 6px;
        }
    }
</style>