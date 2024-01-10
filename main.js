import './style.css'
import * as d3 from 'd3'

const colors = {
  'Wii': '#7f0000',
  'DS': '#a20003',
  'GB': '#c60003',
  'NES': '#ec0001',
  '3DS': '#ff3616',
  'SNES': '#ff6336',
  'N64': '#ff8554',
  'GBA': '#ffa372',
  'X360': '#008e00',
  'XB': '#1ead00',
  'XOne': '#33cd00',
  'PS3': '#000f8e',
  'PS2': '#0427ad',
  'PS4': '#448fff',
  'PS': '#063ccd',
  'PSP': '#0352ee',
  'PC': '#999999',
  '2600': '#d2d2d2'
}

const dataGames = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'


d3.json(dataGames).then(data => {
  const width = 1000
  const height = 800

  const root = d3.treemap()
  .tile(d3.treemapSquarify)
  .size([width, height])
  .padding(1)
  .round(true)
  (d3.hierarchy(data)
  .sum(d => d.value)
  .sort((a,b) => b.value - a.value)
  )

  const svg = d3.select('#app')
  .append('svg')
  .attr('id', 'treemap')
  .attr('viewBox', [0, 0, width, height])
  .attr('width', width)
  .attr('height', height)

  const tooltip = d3.select('body').append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)

  const leaf = svg.selectAll('g')
  .data(root.leaves())
  .join('g')
  .attr('transform', d => `translate(${d.x0}, ${d.y0})`)

  let categories = new Set()
  root.leaves().map(nodes => categories.add(nodes.data.category))

  const numColumns = 3;
  const columnWidth = 150;
  
  let legend = d3.select('#app')
    .append('svg')
    .attr('id', 'legend')
    .attr('width', 500)
    .attr('height', categories.size / numColumns * 30)
    .attr('transform', 'translateX(200)')

  // Crear grupos para cada elemento de la leyenda
  let legendGroups = legend.selectAll('g')
    .data(categories)
    .join('g')
    .attr('transform', (d, i) => `translate(${Math.floor(i % numColumns) * columnWidth},${Math.floor(i / numColumns) * 30})`);

  // Agregar rectángulos a cada grupo
  legendGroups.append('rect')
    .attr('class', 'legend-item')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', d => colors[d])

  // Agregar texto a cada grupo
  legendGroups.append('text')
    .text(d => d)
    .attr('x', 20)
    .attr('y', 13);

  leaf.append('rect')
  .attr('id', d => d.data.id)
  .attr('class', 'tile')
  .attr('data-name', d => d.data.name)
  .attr('data-category', d => d.data.category)
  .attr('data-value', d => d.data.value)
  .attr('fill', d => {
    let cons = d.data.category
    return colors[cons]
  })
  .attr('width', d => d.x1 - d.x0)
  .attr('height', d => d.y1 - d.y0)
  .on('mousemove', (e, d) => {
    tooltip.attr('data-value', d.data.value)
    tooltip.html(`
      Name: ${d.data.name}<br>
      Category: ${d.data.category}<br>
      Value: ${d.data.value}
    `)
    .style('display', 'block')
    .style('opacity', .9)
    .style('left', `${e.pageX + 10}px`)
    .style('top', `${e.pageY - 20}px`)
  })
  .on('mouseleave', () => {
    tooltip.style('display', 'none')
  } )

  leaf.append('clipPath')
  .append('use')
  .attr('xlink:href', d => d.data.name)

  leaf.append("text")
  .attr('class', 'tile-text')
  .selectAll('tspan')
  .data(d => {
    return d.data.name.split(/(?=[A-Z][^A-Z])/g)
  })
  .enter()
  .append('tspan')
  .attr('x', 4)
  .attr('y', (d, i) => {return 13 + i * 10})
  .text(d => {return d})
  .attr('fill', 'white')

})
