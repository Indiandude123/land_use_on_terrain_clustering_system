/*
This script is for sampling micro-watersheds in a particular AEZ. The sampled mws are exported as 
a featurecollection asset
*/
var aez = ee.FeatureCollection("path_to_featurecollection_of_aez"),
mwsheds = ee.FeatureCollection("path_to_featurecollection_of_terrain_cluster_assigned_mws"),
geometry = 
/* color: #ff00ff */
/* displayProperties: [
  {
    "type": "rectangle"
  }
] */
ee.Geometry.Polygon(
    [[[85.5907930383412, 22.265961452057603],
      [85.5907930383412, 20.578532190317716],
      [88.2714571008412, 20.578532190317716],
      [88.2714571008412, 22.265961452057603]]], null, false),
geometry2 = 
/* color: #ff9999 */
/* displayProperties: [
  {
    "type": "rectangle"
  }
] */
ee.Geometry.Polygon(
    [[[83.7286104211537, 20.56824653895947],
      [83.7286104211537, 17.86086463560915],
      [87.0739473352162, 17.86086463560915],
      [87.0739473352162, 20.56824653895947]]], null, false),
geometry3 = 
/* color: #99ff99 */
/* displayProperties: [
  {
    "type": "rectangle"
  }
] */
ee.Geometry.Polygon(
    [[[80.9325899133412, 19.21494326664832],
      [80.9325899133412, 16.65434227638365],
      [83.7066377649037, 16.65434227638365],
      [83.7066377649037, 19.21494326664832]]], null, false),
geometry4 = 
/* color: #9999ff */
/* displayProperties: [
  {
    "type": "rectangle"
  }
] */
ee.Geometry.Polygon(
    [[[78.70887244701983, 16.863175667415515],
      [78.70887244701983, 13.940208909118079],
      [80.96106971264483, 13.940208909118079],
      [80.96106971264483, 16.863175667415515]]], null, false),
geometry5 = 
/* color: #ffff99 */
/* displayProperties: [
  {
    "type": "rectangle"
  }
] */
ee.Geometry.Polygon(
    [[[76.18201697826983, 8.934738351282556],
      [76.18201697826983, 7.684600680106584],
      [78.47815955639483, 7.684600680106584],
      [78.47815955639483, 8.934738351282556]]], null, false);

var aez_num = 13
var num_mwsheds = 62
var descr = 'aez'+ aez_num +'_sampled_mws'
var assetId = 'projects/ee-saheb123singha/assets/aez_sampled_mws/aez'+ aez_num +'_sampled_mws'
var seed = 42


var aez_filtered = aez.filter(ee.Filter.eq('ae_regcode', aez_num));

// Sample Micro-watershed
var aez_mwsheds_0 = mwsheds.filterBounds(aez_filtered)
.filter(ee.Filter.eq("terrain_cluster", 0))
.limit(1000);
print("Hills and Slopes", aez_mwsheds_0)
aez_mwsheds_0 = aez_mwsheds_0.randomColumn({seed:seed}).limit(num_mwsheds, 'random');
aez_mwsheds_0 = aez_mwsheds_0.map(function(feature) {
  return feature.set('random', null);
});
aez_mwsheds_0 = aez_mwsheds_0.map(function(feature) {
  return feature.set('DN', null);
});


// Sample Micro-watershed
var aez_mwsheds_1 = mwsheds.filterBounds(aez_filtered)
.filter(ee.Filter.eq("terrain_cluster", 1))
.limit(1000);
print("Mostly Plains", aez_mwsheds_1)
aez_mwsheds_1 = aez_mwsheds_1.randomColumn({seed:seed}).limit(num_mwsheds, 'random');
aez_mwsheds_1 = aez_mwsheds_1.map(function(feature) {
  return feature.set('random', null);
});
aez_mwsheds_1 = aez_mwsheds_1.map(function(feature) {
  return feature.set('DN', null);
});


// Sample Micro-watershed
var aez_mwsheds_2 = mwsheds.filterBounds(aez_filtered)
.filter(ee.Filter.eq("terrain_cluster", 2))
.limit(1000);
print("Hills and Valleys", aez_mwsheds_2)
aez_mwsheds_2 = aez_mwsheds_2.randomColumn({seed:seed}).limit(num_mwsheds, 'random');
aez_mwsheds_2 = aez_mwsheds_2.map(function(feature) {
  return feature.set('random', null);
});
aez_mwsheds_2 = aez_mwsheds_2.map(function(feature) {
  return feature.set('DN', null);
});


// Sample Micro-watershed
var aez_mwsheds_3 = mwsheds.filterBounds(aez_filtered)
.filter(ee.Filter.eq("terrain_cluster", 3))
.limit(1000);
print("Plains and Slopes", aez_mwsheds_3)
aez_mwsheds_3 = aez_mwsheds_3.randomColumn({seed:seed}).limit(num_mwsheds, 'random');
aez_mwsheds_3 = aez_mwsheds_3.map(function(feature) {
  return feature.set('random', null);
});
aez_mwsheds_3 = aez_mwsheds_3.map(function(feature) {
  return feature.set('DN', null);
});


// Combine features into feature collection
var aez_mwsheds = aez_mwsheds_0.merge(aez_mwsheds_1)
.merge(aez_mwsheds_2)
.merge(aez_mwsheds_3);
print("Stratified Sampled mws:", aez_mwsheds) 

Map.addLayer(aez_mwsheds);
// print(aez_mwsheds)

// Export.table.toAsset({
//   collection: aez_mwsheds,
//   description: descr,
//   assetId: assetId,
// });


/* 
############# Spatial level chunking and export ############# 
*/
var clipped_chunk = aez_mwsheds.filterBounds(geometry)
print(clipped_chunk)
Export.table.toAsset({
  collection: clipped_chunk,
  description: descr + '_spatial_chunk_1',
  assetId: assetId + '_spatial_chunk_1',
});


var clipped_chunk = aez_mwsheds.filterBounds(geometry2)
print(clipped_chunk)
Export.table.toAsset({
  collection: clipped_chunk,
  description: descr + '_spatial_chunk_2',
  assetId: assetId + '_spatial_chunk_2',
});


var clipped_chunk = aez_mwsheds.filterBounds(geometry3)
print(clipped_chunk)
Export.table.toAsset({
  collection: clipped_chunk,
  description: descr + '_spatial_chunk_3',
  assetId: assetId + '_spatial_chunk_3',
});


var clipped_chunk = aez_mwsheds.filterBounds(geometry4)
print(clipped_chunk)
Export.table.toAsset({
  collection: clipped_chunk,
  description: descr + '_spatial_chunk_4',
  assetId: assetId + '_spatial_chunk_4',
});


var clipped_chunk = aez_mwsheds.filterBounds(geometry5)
print(clipped_chunk)
Export.table.toAsset({
  collection: clipped_chunk,
  description: descr + '_spatial_chunk_5',
  assetId: assetId + '_spatial_chunk_5',
});
