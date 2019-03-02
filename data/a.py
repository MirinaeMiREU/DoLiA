import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as colors

N = 5
X, Y = np.mgrid[-3:3:complex(0, N), -2:2:complex(0, N)]
print(X,'d')
print(Y)
# A low hump with a spike coming out of the top right.  Needs to have
# z/colour axis on a log scale so we see both hump and spike.  linear
# scale only shows the spike.
Z1 = np.exp(-(X)**2 - (Y)**2)
Z2 = np.exp(-(X * 10)**2 - (Y * 10)**2)
Z = Z1 + 50 * Z2
print(Z)
print(Z.min())
print(Z.max())
fig, ax = plt.subplots(2, )

pcm = ax[0].pcolor(X, Y, Z,
                   norm=colors.LogNorm(vmin=Z.min(), vmax=Z.max()),
                   cmap='PuBu_r')
fig.colorbar(pcm, ax=ax[0], extend='max')

pcm = ax[1].pcolor(X, Y, Z, cmap='PuBu_r')
fig.colorbar(pcm, ax=ax[1], extend='max')
fig.show()
