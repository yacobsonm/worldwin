<template>
    <v-layout column class="content">
        <div>
            <img src="../assets/annotation.png" class="icon" draggable="true"/>
            Drag annotation and drop it to the map.
            <div>Double click on existing to modify.</div>
        </div>

        <div class="switches">
            <v-switch
                    v-model="showWalmart"
                    label="Show Walmart stores"
                    @change="$emit('toggleLayerVisibility','Walmart')"

            />
            <v-switch
                    v-model="showTarget"
                    label="Show Target stores"
                    @change="$emit('toggleLayerVisibility','Target')"

            />
            <v-switch
                    v-model="showAnnotations"
                    label="Show Annotations"
                    @change="$emit('toggleLayerVisibility','Annotations')"

            />
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
</style>