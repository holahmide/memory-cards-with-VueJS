<template>
  <div class="p-12">
    <div class="text-center">
      <div class="text-xl font-bold">Memory Cards</div>
      <div class="text-sm">Flip any card and flip another matching card</div>
      <div class="text-lg">Tries: {{ tries }}, Matches: {{ matches }}</div>
    </div>
    <div class="flex flex-wrap justify-center">
      <div v-for="(image, index) in images" :key="index" class="m-3">
        <div class="flip-card">
          <div
            :id="`flip-card-${index}-inner`"
            class="flip-card-inner"
            @click="onCardFlip(index)"
          >
            <div class="flip-card-front">
              <img
                src="@/assets/img/default_image.jpg"
                style="width: 300px; height: 200px"
                alt="Default"
              />
            </div>
            <div class="flip-card-back">
              <img
                :src="$image(image.src)"
                style="width: 300px; height: 200px"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mt-4">
      <button
        @click="resetGame"
        class="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition hover:scale-125"
      >
        Reset Game
      </button>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
export default {
  setup() {
    const grouping = 2;
    const rawImages = ref([
      "assets/img/property-8.jpg",
      "assets/img/property-9.jpg",
      "assets/img/property-10.jpg",
      "assets/img/property-a.jpeg",
      "assets/img/property-b.jpeg",
      "assets/img/property-c.jpeg",
      "assets/img/property-d.jpeg",
    ]);
    const images = ref([]);

    onBeforeMount(() => {
      // Group Images
      // Replicate images based on the groups
      for (let i = 0; i < grouping; i++) {
        rawImages.value.map((image, index) => {
          images.value.push({
            src: image,
            group: index + 1,
            clicked: false,
          });
        });
      }
      // shuffle images
      images.value.forEach((val, key) => {
        let randomIndex = Math.ceil(Math.random() * (key + 1));
        images.value[key] = images.value[randomIndex];
        images.value[randomIndex] = val;
      });
    });

    let activeGroup = null;
    const clickedImages = ref([]);
    let tries = ref(0);
    const matches = ref(0);
    const onCardFlip = (index) => {
      if (images.value[index].clicked == true) return; // CHeck if image has been previously clicked
      toogleImage(index); // Flip image
      clickedImages.value.push(index); // Add to clicked images
      images.value[index].clicked = true; // set the clicked property of the image

      if (activeGroup == null) {
        activeGroup = images.value[index].group; // if first images to be clicked
      } else {
        tries.value++;
        setTimeout(() => confirmMatch(index), 1000);
      }
    };

    const confirmMatch = (index) => {
      // if group of next image clicked is equal to the first
      if (images.value[index].group == activeGroup) {
        matches.value++;
        resetImages();
      } else {
        // if not
        closeClickedImages();
        resetImages();
      }
    };

    const closeClickedImages = () => {
      clickedImages.value.map((index) => {
        images.value[index].clicked = false;
        toogleImage(index);
      });
    };
    const toogleImage = (index) => {
      document
        .getElementById(`flip-card-${index}-inner`)
        .classList.toggle("transform-div");
    };
    const resetImages = () => {
      activeGroup = null;
      clickedImages.value = [];
    };
    const resetGame = () => {
      resetImages();
      images.value.map((image, index) => {
        image.clicked = false;
        document
          .getElementById(`flip-card-${index}-inner`)
          .classList.remove("transform-div");
      });
      tries.value = 0;
      matches.value = 0;
    };

    return {
      onCardFlip,
      resetGame,
      images,
      tries,
      matches,
    };
  },
};
</script>

<style scoped>
.flip-card {
  background-color: transparent;
  width: 300px;
  height: 200px;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 8s;
  transform-style: preserve-3d;
  -webkit-transition: transform 1s ease-in-out;
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
.flip-card-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
}

/* Class to transform */
.transform-div {
  transform: rotateY(180deg);
}
</style>
