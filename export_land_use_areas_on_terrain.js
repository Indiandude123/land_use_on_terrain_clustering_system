
var aez_sampled_mws_lf = ee.Image("path_to_landform_classification_raster"),
    aez_sampled_mws = ee.FeatureCollection("path_to_feature_collection_of_sampled_mws"),
    image = ee.Image("path_to_2017_lulc"),
    image2 = ee.Image("path_to_2018_lulc"),
    image3 = ee.Image("path_to_2019_lulc"),
    image4 = ee.Image("path_to_2020_lulc"),
    image5 = ee.Image("path_to_2021_lulc"),
    image6 = ee.Image("path_to_2022_lulc");


var csv_export_folder = "LulcXLandforms"
var aez_regcode = 15
var filename = "aez" + aez_regcode + "_sampled_mws_landforms_x_lulc_area_";

var aez_mwsheds = aez15_sampled_mws;
var aez_mwsheds_lf_raster = aez15_sampled_mws_lf;

var terrainUtils = require("users/saheb123singha/research_work:terrain_utils");

// Assign Terrain level clusters to sampled mwsheds
aez_mwsheds = aez_mwsheds.map(terrainUtils.assignClusters);


// LULC mode over 6 years for sampled mwsheds
var generateLULCModeRaster = function(feature){
  var clippedImage = image.clip(feature.geometry());
  var clippedImage2 = image2.clip(feature.geometry());
  var clippedImage3 = image3.clip(feature.geometry());
  var clippedImage4 = image4.clip(feature.geometry());
  var clippedImage5 = image5.clip(feature.geometry());
  var clippedImage6 = image6.clip(feature.geometry());
  
  var images = [clippedImage, clippedImage2, clippedImage3, clippedImage4, clippedImage5, clippedImage6];
  var images_collection = ee.ImageCollection.fromImages(images);
  var aez_lulc_mode = images_collection.mode();
  
  return aez_lulc_mode;
};
var aez_mwsheds_lulc_rasters = ee.ImageCollection(aez_mwsheds.map(generateLULCModeRaster));
var aez_mwsheds_lulc_raster = aez_mwsheds_lulc_rasters.mosaic();


var computeLulcAreasOnLandforms = function(feature) {
  var landforms = aez_mwsheds_lf_raster; 
  var area_lulc = aez_mwsheds_lulc_raster;
  var studyArea = feature.geometry();
  var lf300x2k = landforms.clip(studyArea);
  
  
  var study_area = lf300x2k.select('constant');
  var lulc = area_lulc.select('predicted_label');
  
  /*10 landforms to 5 general landforms */
  
  var slopy = lf300x2k.eq(6);
  var plains = lf300x2k.eq(5).or(lf300x2k.gte(12));
  var steep_slopes = lf300x2k.eq(8);
  var ridge = lf300x2k.eq(7).or(lf300x2k.gte(9).and(lf300x2k.lte(11)));
  var valleys = lf300x2k.gte(1).and(lf300x2k.lte(4));
  
  
  var plain_area = ee.Number((plains.eq(1)).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  var valley_area = ee.Number((valleys.eq(1)).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  var hill_slopes_area = ee.Number((steep_slopes.eq(1)).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var mwshed_area = ee.Number(study_area.neq(0).multiply(ee.Image.pixelArea()).reduceRegion({
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  var valley_single_kharif = ee.Number((valleys.eq(1).and(lulc.eq(8))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  
  var valley_single_non_kharif = ee.Number((valleys.eq(1).and(lulc.eq(9))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  var valley_double = ee.Number((valleys.eq(1).and(lulc.eq(10))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                             
  var valley_triple = ee.Number((valleys.eq(1).and(lulc.eq(11))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
                              
  var valley_forests = ee.Number((valleys.eq(1).and(lulc.eq(6))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var valley_barren = ee.Number((valleys.eq(1).and(lulc.eq(7))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var valley_shrub_scrub = ee.Number((valleys.eq(1).and(lulc.eq(12))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);                            
                              
  
  /* ----------------- Ridges ---------------------------*/
  
  var ridge_single_kharif = ee.Number((ridge.eq(1).and(lulc.eq(8))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  
  var ridge_single_non_kharif = ee.Number((ridge.eq(1).and(lulc.eq(9))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  var ridge_double = ee.Number((ridge.eq(1).and(lulc.eq(10))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                             
  var ridge_triple = ee.Number((ridge.eq(1).and(lulc.eq(11))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
                              
  var ridge_forests = ee.Number((ridge.eq(1).and(lulc.eq(6))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var ridge_barren = ee.Number((ridge.eq(1).and(lulc.eq(7))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var ridge_shrub_scrub = ee.Number((ridge.eq(1).and(lulc.eq(12))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);    
                              
                              
  var ridge_area = ee.Number((ridge.eq(1)).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  /* ----------------Slopy -----------  */
  var slopy_single_kharif = ee.Number((slopy.eq(1).and(lulc.eq(8))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  
  var slopy_single_non_kharif = ee.Number((slopy.eq(1).and(lulc.eq(9))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  var slopy_double = ee.Number((slopy.eq(1).and(lulc.eq(10))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                             
  var slopy_triple = ee.Number((slopy.eq(1).and(lulc.eq(11))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
                              
  var slopy_forests = ee.Number((slopy.eq(1).and(lulc.eq(6))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var slopy_barren = ee.Number((slopy.eq(1).and(lulc.eq(7))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var slopy_shrub_scrub = ee.Number((slopy.eq(1).and(lulc.eq(12))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);    
  
  var slopy_area = ee.Number((slopy.eq(1)).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  
  
  // from here for plains
  var plains_forest = ee.Number((plains.eq(1).and(lulc.eq(6))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  
  var plains_barren = ee.Number((plains.eq(1).and(lulc.eq(7))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  var plains_single_crop = ee.Number((plains.eq(1).and(lulc.eq(8))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                          
  var plains_single_non_kharif_crop = ee.Number((plains.eq(1).and(lulc.eq(9))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
                              
  var plains_double_crop = ee.Number((plains.eq(1).and(lulc.eq(10))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var plains_triple_crop = ee.Number((plains.eq(1).and(lulc.eq(11))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  var plains_shrubs_scrubs = ee.Number((plains.eq(1).and(lulc.eq(12))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  /***********************/
  
  
  var steep_slopes_single_kharif = ee.Number((steep_slopes.eq(1).and(lulc.eq(8))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  
  var steep_slopes_single_non_kharif = ee.Number((steep_slopes.eq(1).and(lulc.eq(9))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
  
  var steep_slopes_double = ee.Number((steep_slopes.eq(1).and(lulc.eq(10))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                             
  var steep_slopes_triple = ee.Number((steep_slopes.eq(1).and(lulc.eq(11))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
                              
  var steep_slopes_forests = ee.Number((steep_slopes.eq(1).and(lulc.eq(6))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var steep_slopes_barren = ee.Number((steep_slopes.eq(1).and(lulc.eq(7))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);
                              
  var steep_slopes_shrub_scrub = ee.Number((steep_slopes.eq(1).and(lulc.eq(12))).multiply(ee.Image.pixelArea()).reduceRegion(
                              {
                                reducer : ee.Reducer.sum(),
                                geometry: studyArea,
                                scale:30,
                                maxPixels:1e10
                              }).get('constant')).divide(1e4);


  feature =  feature.set('Area of Microwatershed', mwshed_area);
  
  feature =feature.set('Total Plain Area', plain_area);
  feature =feature.set('Plains Tree/Forests', plains_forest);
  feature =feature.set('Plains Barrenlands', plains_barren);
  feature =feature.set('Plains Single Cropping', plains_single_crop);
  feature =feature.set('Plains Single Non Kharif Cropping', plains_single_non_kharif_crop);
  feature =feature.set('Plains Double Cropping', plains_double_crop);
  feature =feature.set('Plains Triple Cropping', plains_triple_crop);
  feature =feature.set('Plains Shrub_Scrub', plains_shrubs_scrubs);
  
  feature =feature.set('Total Valley Area', valley_area);
  feature =feature.set('Valley Single Cropping', valley_single_kharif);
  feature =feature.set('Valley Single Non Kharif' , valley_single_non_kharif);
  feature =feature.set('Valley Double' , valley_double);
  feature =feature.set('Valley Triple' , valley_triple);
  feature =feature.set('Valley Forests' , valley_forests);
  feature =feature.set('Valley Barren' , valley_barren);
  feature =feature.set('Valley Scrub', valley_shrub_scrub);
  
  feature =feature.set('Total Ridge/Hilly Area', ridge_area);
  feature =feature.set('Ridge/Hilly Single Cropping', ridge_single_kharif);
  feature =feature.set('Ridge/Hilly Single Non Kharif' , ridge_single_non_kharif);
  feature =feature.set('Ridge/Hilly Double' , ridge_double);
  feature =feature.set('Ridge/Hilly Triple' , ridge_triple);
  feature =feature.set('Ridge/Hilly Forests' , ridge_forests);
  feature =feature.set('Ridge/Hilly Barren' , ridge_barren);
  feature =feature.set('Ridge/Hilly Scub' , ridge_shrub_scrub);
  
  feature =feature.set('Total Broad Slopy Area', slopy_area);
  feature =feature.set('Broad Slopy Tree/Forests', slopy_forests);
  feature =feature.set('Broad Slopy Barrenlands', slopy_barren);
  feature =feature.set('Broad Slopy Single Cropping', slopy_single_kharif);
  feature =feature.set('Broad Slopy Single Non Kharif Cropping', slopy_single_non_kharif);
  feature =feature.set('Broad Slopy Double Cropping', slopy_double);
  feature =feature.set('Broad Slopy Triple Cropping', slopy_triple);
  feature =feature.set('Broad Slopy Shrub_Scrub', slopy_shrub_scrub);
  
  feature =feature.set('Total Steep Slopes Area', hill_slopes_area);
  feature =feature.set('Steep Slopes Tree/Forests', steep_slopes_forests);
  feature =feature.set('Steep Slopes Barrenlands', steep_slopes_barren);
  feature =feature.set('Steep Slopes Single Cropping', steep_slopes_single_kharif);
  feature =feature.set('Steep Slopes Single Non Kharif Cropping', steep_slopes_single_non_kharif);
  feature =feature.set('Steep Slopes Double Cropping', steep_slopes_double);
  feature =feature.set('Steep Slopes Triple Cropping', steep_slopes_triple);
  feature =feature.set('Steep Slopes Shrub_Scrub', steep_slopes_shrub_scrub);

  return feature;
};


var chunk_size = 20;
var num_chunks = aez_mwsheds.size().divide(chunk_size).ceil().getInfo();
var aez_mwsheds_list = aez_mwsheds.toList(aez_mwsheds.size());

for (var i = 0; i < num_chunks; i++) {
  var start_idx = i * chunk_size;
  var end_idx = start_idx + chunk_size;
  end_idx = ee.Number(end_idx).min(aez_mwsheds_list.size());
  
  var chunk = aez_mwsheds_list.slice(start_idx, end_idx);
  var chunk_fc = ee.FeatureCollection(chunk);
  
  var fc = chunk_fc.map(computeLulcAreasOnLandforms);
  
  print(fc);
  var chunk_fc_export_name = filename + "chunk" + i;
  
  Export.table.toDrive({
    collection: fc,
    description: chunk_fc_export_name,
    folder: csv_export_folder,
    fileFormat: 'CSV'
  });
}




