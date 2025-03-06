import pandas as pd
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import seaborn as sns
from elbow_plot import elbow_plot
import numpy as np
import os

aez_chunks_file_path = "path_to_land_use_on_terrain_aez_specific_mwses"

file_paths=[]
for files in os.listdir(aez_chunks_file_path):
    if files.endswith('.csv'):
        file_path = os.path.join(aez_chunks_file_path, files)
        file_paths.append(file_path)
        
df = pd.read_csv(file_paths[0])
for i in range(1, len(file_paths)):
    df_temp = pd.read_csv(file_paths[i])
    df = pd.concat([df, df_temp], axis=0)
seed = 42

print(df["terrain_cluster"].value_counts())


df_cluster03 = df[df['terrain_cluster'].isin([0, 3])]
print("Shape: ", df_cluster03.shape)



slopy_cluster_features = ['Broad Slopy Barrenlands','Broad Slopy Shrub_Scrub', 'Broad Slopy Tree/Forests',
                      'Broad Slopy Double Cropping', 'Broad Slopy Single Cropping', 'Broad Slopy Single Non Kharif Cropping', 'Broad Slopy Triple Cropping']

df_cluster03["slopy_features_area_sum"] = 0
for feature in slopy_cluster_features:
    df_cluster03["slopy_features_area_sum"] += df_cluster03[feature]

df_cluster03["percent_diff_total_area"] = ((df_cluster03["Total Broad Slopy Area"]-df_cluster03["slopy_features_area_sum"])/df_cluster03["Total Broad Slopy Area"]) * 100
df_cluster03 = df_cluster03[np.abs(df_cluster03['percent_diff_total_area']) <= 30]

for feature in slopy_cluster_features:
    df_cluster03[feature + ' Fraction'] = df_cluster03[feature] /(df_cluster03['Total Broad Slopy Area'] + df_cluster03['Total Plain Area'])
    
fraction_slope_features = [feature + ' Fraction' for feature in slopy_cluster_features]
print(fraction_slope_features)
df_cluster03.dropna(subset=fraction_slope_features, inplace=True)


elbow_plot(df_cluster03[fraction_slope_features], 5)


num_clusters = 2
kmeans = KMeans(n_clusters=num_clusters, random_state=seed)
df_cluster03['lulc_x_slope_cluster'] = kmeans.fit_predict(df_cluster03[fraction_slope_features])

centroids  = kmeans.cluster_centers_ 
print("centroids: ", centroids)


print("Level 2 clusters\n")
print(df_cluster03['lulc_x_slope_cluster'].value_counts())


fig, axes = plt.subplots(nrows=1, ncols=num_clusters, figsize=(18, 6), sharey=True)

x_labels = [feature.replace(' Fraction', '') for feature in fraction_slope_features]
# x_labels = [feature.replace(' Fraction', '').replace(' ', ' \n ') for feature in fraction_slope_features]

for cluster_id, ax in enumerate(axes.flatten(), start=0):
    cluster_data = df_cluster03[df_cluster03['lulc_x_slope_cluster'] == cluster_id]
    sns.boxplot(data=cluster_data[fraction_slope_features], ax=ax)
    ax.set_title(f'Cluster {cluster_id}', fontsize=14) 
    ax.set_xticklabels(x_labels, rotation=75, fontsize=12)  
    ax.set_ylabel('Fraction', fontsize=12)  

plt.tight_layout()
plt.show()