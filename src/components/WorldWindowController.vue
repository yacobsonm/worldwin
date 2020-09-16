<template>
    <v-layout column class="content">
        <div>
            <img src="icons/annotation.png" class="icon" draggable="true"/>
            Drag annotation and drop it to the map.
            <div>Double click on existing to modify.</div>
        </div>

        <div class="switches">
            <v-switch
                    v-model="showWalmart"
                    hide-details
                    @change="$emit('toggleLayerVisibility','Walmart')">
                <template v-slot:label>
                    <v-layout>
                       <span class="store-label"> Show Walmart stores </span>

                        <img src="/icons/walmart.png"  class="icon "/>
                    </v-layout>
                </template>

            </v-switch>

            <v-switch
                    v-model="showTarget"
                    hide-details
                    @change="$emit('toggleLayerVisibility','Target')">
                <template v-slot:label>
                    <v-layout>
                        <span class="store-label"> Show Target stores </span>

                        <img src="/icons/target.png"  class="icon "/>
                    </v-layout>
                </template>

            </v-switch>

            <v-switch
                    v-model="showAnnotations"
                    @change="$emit('toggleLayerVisibility','Annotations')">
                <template v-slot:label>
                        <span class="store-label"> Show Annotations </span>
                </template>

            </v-switch>
        </div>
    </v-layout>

</template>

<script>
    export default {
        name: "WorldWindowController",

        data: () => (
            {
                showWalmart: true,
                showTarget: true,
                showAnnotations: true,

            }
        ),
    }
</script>

<style scoped lang="less">
    .content {
        min-width: 400px;
        max-width: 400px;
        font-weight: bold;
    }
    .switches {
        padding-left: 20px;
    }
    .icon {
        width: 32px;
        height: 32px;
    }
    .store-label {
        margin: 6px 8px 0 8px;
    }
</style>