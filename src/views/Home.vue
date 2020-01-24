<template>
  <div>
    <sidebar
    @change-state="changeState"
    @change-city="changeCity"/>
    <ise-map ref="map"/>
  </div>
</template>

<script>
import sidebar from '../components/Sidebar'
import map from '../components/Map'

export default {
  name: 'Home',
  components: {
    sidebar,
    "ise-map": map
  },
  methods: {
    changeState(state) {
      this.$refs.map.changeState(state)
    },
    changeCity(state, city) {
      this.$refs.map.changeCity(state, city)
    }
  }
}
</script>
