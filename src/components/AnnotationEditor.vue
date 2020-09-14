<template>
    <v-menu
            v-model="showEditor"
            absolute
            :close-on-content-click="false"
            :close-on-click="false"
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
            </v-card-text>
            <v-card-actions>
                <v-btn style="margin-left: 20px"  @click="deleteAnnotation">Delete</v-btn>

                <v-spacer/>
                <v-btn color="primary" @click="ok">Ok</v-btn>
                <v-btn style="margin-left: 20px"  @click="close">Cancel</v-btn>
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
            annotation: {},
            event: undefined,
            text: ""
        }),

        methods: {
            ok() {
                this.$emit('updateAnnotation', this.event, this.text, this.annotation);
                this.showEditor = false;

            },
            deleteAnnotation() {
                this.$emit('deleteAnnotation', this.annotation);
                this.showEditor = false;
            },
            close() {
                this.showEditor=false;
                this.$emit('close');
            }
        },
        watch: {
            evt(newVal/*, oldVal*/) {
                if (newVal) {
                    this.showEditor = true;
                    this.event = newVal.event;
                    if (newVal.annotation) {
                        this.annotation = newVal.annotation;
                        this.text = newVal.annotation.text;
                        this.backgroundColor = this.annotation.backgroundColor;
                    } else {
                        this.annotation = undefined;
                        this.text = undefined;
                    }
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