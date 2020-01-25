<template>
  <div 
  :id="'chart' + idChart"
  style="width: 75%; margin: 0 auto;">
  </div>
</template>

<script>
export default {
  props: [
    'idChart', 'chartData', 'locationName'
  ],
  watch: {
    chartData() {
      this.drawChart()
    }
  },
  beforeMount() {
    window.google.charts.setOnLoadCallback(this.drawChart);
  },
	methods: {
		drawChart() {
      let data = new window.google.visualization.DataTable();
      data.addColumn('string', 'Ano')
      data.addColumn('number', 'Nota IDEB');

      data.addRows(this.chartData);

      let chart = new window.google.visualization.ColumnChart(document.getElementById('chart' + this.idChart));
      let options = {
        title: `Histórico de notas do IDEB - ${this.locationName}`,
        backgroundColor: '#fafafa'
      }

      chart.draw(data, options);
    }
	}
}
</script>