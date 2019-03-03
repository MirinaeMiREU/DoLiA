# library
import seaborn as sns
import pandas as pd
import numpy as np
 
# Create long format
people=np.repeat(("A","B","C","D","E"),5)
feature=[1,2,3,4,5]
value=np.random.random(25)
df=pd.DataFrame({'feature': feature, 'people': people, 'value': value })
 
# plot it
df_wide=df.pivot_table( index='people', columns='feature', values='value' )
p2=sns.heatmap( df_wide )
sns.plt.show()
