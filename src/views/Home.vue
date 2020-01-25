<template>
  <div>
    <error-box
    ref="box"
    :message="errorMsg"/>

    <sidebar
    @change-state="changeState"
    @change-city="changeCity"
    @change-school="changeSchool"
    @show-best-school="showBestSchool"
    @error-server="showError"/>

    <ise-map 
    ref="map"
    @error-server="showError"/>
  </div>
</template>

<script>
import sidebar from '../components/Sidebar'
import map from '../components/Map'
import errorbox from '../components/ErrorBox'

export default {
  name: 'Home',
  components: {
    sidebar,
    "ise-map": map,
    "error-box": errorbox
  },
  data() {
    return {
      errorMsg: ""
    }
  },
  methods: {
    changeState(stateName) {
      this.$refs.map.changeState(stateName)
    },
    changeCity(stateName, cityName) {
      this.$refs.map.changeCity(stateName, cityName)
    },
    changeSchool(stateName, cityName, school) {
      this.$refs.map.changeSchool(stateName, cityName, school)
    },
    showBestSchool(state, cityName) {
      this.$refs.map.showBestSchool(state, cityName)
    },
    showError(error) {
      this.errorMsg = error
      this.$refs.box.activeMsg()
    }
  }
}
</script>

<style scoped>
.alert {
  position: fixed;
  right: 0;
}
</style>