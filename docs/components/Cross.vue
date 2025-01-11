<template>
  <div class="cross">
    <div class="h"></div>
    <div class="v"></div>
  </div>
</template>
<style scope>
.cross {
  position: relative;
  filter: drop-shadow(0px 0px 1px white) drop-shadow(0px 0px 1px white) drop-shadow(0px 0px 1px white);
}
.h {
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 1px;
  background-color: black;
  transform: translate(-50%, -50%);
}
.v {
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 10px;
  background-color: black;
  transform: translate(-50%, -50%);
}
</style>
