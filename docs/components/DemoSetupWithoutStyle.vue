<template>
    <div style="width: 200px; height: 250px; background: white; position: relative">
        <div class="layer-flip-front" style="position: absolute; left: 50px; top: 50px; width: 100px; height: 150px;">
            <div class="item" style="width: 100px; height: 150px; background: green">Front Front Front</div>
        </div>
        <div class="layer-shadow" style="position: absolute; left: 50px; top: 50px; width: 100px; height: 150px;">
            <div class="item" style="width: 100px; height: 150px"></div>
        </div>
        <div class="layer-flip-back" style="position: absolute; left: 50px; ; top: 50px; width: 100px; height: 150px;">
            <div class="item" style="width: 100px; height: 150px; background: blue">Back Back Back</div>
        </div>
        <div class="layer-effect" style="position: absolute; left: 50px; top: 50px; width: 100px; height: 150px;">
            <div class="item" style="width: 100px; height: 150px"></div>
        </div>
    </div>
</template>