# Land Use Clustering on Terrain in Agro-Ecological Zones

## Overview
This project involves clustering land use patterns on terrain within micro-watersheds across India's 20 Agro-Ecological Zones (AEZs). The methodology includes terrain-level clustering, stratified sampling, landform classification, land use analysis, and clustering of land use features on plains and slopes. The results help in understanding dominant land use patterns and their distribution across different landforms.

## Methodology

### 1. **Terrain-Level Clustering and Stratified Sampling**
- Micro-watersheds are assigned terrain-level clusters.
- Stratified sampling is performed for each AEZ.

### 2. **Landform and Land Use Classification**
- Landform raster images are generated using a classification system.
- Land Use Land Cover (LULC) raster images are generated for the years 2017-2022.
- A temporal mode composite of the LULC rasters is created to identify dominant land use patterns.
- The landform raster is categorized into five broad types:
  - Plains
  - Broad Slopes
  - Steep Slopes
  - Valleys
  - Ridges

### 3. **Feature Computation for Clustering**
- The area under different land covers within each landform is calculated and defined as "potential features."
- Micro-watersheds are classified into two types:
  - **Plain-Type**: Includes terrain clusters labeled as "Mostly Plains," "Hills and Slopes," or "Plains and Slopes."
  - **Slope-Type**: Includes terrain clusters labeled as "Hills and Slopes" or "Plains and Slopes."
- Features are normalized using the total area under plains and slopes combined.

### 4. **Clustering Features**
#### **For Plain-Type Micro-Watersheds**:
- Plains Barrenlands  
- Plains Double Cropping  
- Plains Shrub/Scrub  
- Plains Single Cropping  
- Plains Single Non-Kharif Cropping  
- Plains Tree/Forests  
- Plains Triple Cropping  

#### **For Slope-Type Micro-Watersheds**:
- Broad Slopy Barrenlands  
- Broad Slopy Shrub/Scrub  
- Broad Slopy Tree/Forests  
- Broad Slopy Double Cropping  
- Broad Slopy Single Cropping  
- Broad Slopy Single Non-Kharif Cropping  
- Broad Slopy Triple Cropping  

### 5. **Cluster Computation Across AEZs**
- Separate clusters are computed for plain-type and slope-type micro-watersheds across all 20 AEZs.
- Precomputed cluster centroids are used to assign land use clusters to any micro-watershed from any AEZ in India.




