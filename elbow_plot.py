
from sklearn.cluster import KMeans
import numpy as np
import matplotlib.pyplot as plt

seed = 42

def elbow_plot(X, max_clusters):
    """
    Generate an elbow plot for K-means clustering using distortion (inertia) metric.

    Parameters:
    - X: Input data array (n_samples, n_features)
    - max_clusters: Maximum number of clusters to consider

    Returns:
    - None (plots the elbow plot)
    """
    distortions = []

    for k in range(1, max_clusters + 1):
        kmeans = KMeans(n_clusters=k, random_state=seed)
        kmeans.fit(X)
        distortions.append(kmeans.inertia_)

    # Plot elbow plot with distortion
    plt.plot(range(1, max_clusters + 1), distortions, 'bx-')
    plt.xlabel('Number of clusters (K)')
    plt.ylabel('Distortion')
    plt.title('Elbow Method with Distortion')
    plt.xticks(range(1, max_clusters + 1))
    plt.show()
