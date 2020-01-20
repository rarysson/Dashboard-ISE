<template>
  <div>
    <sidebar/>
    <ise-map/>
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
  }
}
</script>
