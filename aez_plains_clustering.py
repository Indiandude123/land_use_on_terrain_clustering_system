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

df_cluster013 = df[df['terrain_cluster'].isin([0, 1, 3])]
plain_cluster_features = ['Plains Barrenlands', 'Plains Double Cropping', 'Plains Shrub_Scrub',
            'Plains Single Cropping', 'Plains Single Non Kharif Cropping',
            'Plains Tree/Forests', 'Plains Triple Cropping']

df_cluster013["plain_features_area_sum"] = 0
for feature in plain_cluster_features:
    df_cluster013["plain_features_area_sum"] += df_cluster013[feature]

df_cluster013["percent_diff_total_area"] = ((df_cluster013["Total Plain Area"]-df_cluster013["plain_features_area_sum"])/df_cluster013["Total Plain Area"]) * 100
df_cluster013 = df_cluster013[np.abs(df_cluster013['percent_diff_total_area']) <= 30]

for feature in plain_cluster_features:
    df_cluster013[feature + ' Fraction'] = df_cluster013[feature] / (df_cluster013['Total Broad Slopy Area'] + df_cluster013['Total Plain Area'])
    
fraction_plains_features = [feature + ' Fraction' for feature in plain_cluster_features]
df_cluster013.dropna(subset=fraction_plains_features, inplace=True)

# # finding optimal number of clusters using visual inspection of elbow plot
elbow_plot(df_cluster013[fraction_plains_features], 8)


num_clusters = 3
kmeans = KMeans(n_clusters=num_clusters, random_state=seed)
df_cluster013['lulc_x_plain_cluster'] = kmeans.fit_predict(df_cluster013[fraction_plains_features])

centroids  = kmeans.cluster_centers_ 
print("centroids: ", centroids)

print("Level 2 clusters\n")
print(df_cluster013['lulc_x_plain_cluster'].value_counts())


fig, axes = plt.subplots(nrows=1, ncols=3, figsize=(18, 6), sharey=True)

x_labels = [feature.replace(' Fraction', '') for feature in fraction_plains_features]
# x_labels = [feature.replace(' Fraction', '').replace(' ', ' \n ') for feature in fraction_plains_features]

for cluster_id, ax in enumerate(axes.flatten(), start=0):
    cluster_data = df_cluster013[df_cluster013['lulc_x_plain_cluster'] == cluster_id]
    sns.boxplot(data=cluster_data[fraction_plains_features], ax=ax)
    ax.set_title(f'Cluster {cluster_id}', fontsize=14)  
    ax.set_xticklabels(x_labels, rotation=70, fontsize=10)  
    ax.set_ylabel('Fraction', fontsize=12) 


plt.tight_layout()


plt.show()