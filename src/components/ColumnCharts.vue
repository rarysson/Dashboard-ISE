<template>
  <div :id="'chart' + idChart"></div>
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
	methods: {
		drawChart() {
      let data = new window.google.visualization.DataTable();
      data.addColumn('string', 'Ano')
      data.addColumn('number', 'Nota IDEB');

      data.addRows(this.chartData);

      let chart = new window.google.visualization.ColumnChart(document.getElementById('chart' + this.idChart));
      let options = {
        title: `Histórico de notas do IDEB - ${this.locationName}`
      }

      chart.draw(data, options);
    }
	}
}
</script>