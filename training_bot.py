from tensorflow.keras.models import Sequential
import matplotlib.pyplot as plt
import random
from tensorflow.keras.layers import Conv2D , MaxPooling2D , Dense , Flatten
import numpy as np

# Loading Dataset 

X_train = np.loadtxt('input.csv',delimiter = ',')
Y_train = np.loadtxt('labels.csv',delimiter = ',')

X_test = np.loadtxt('input_test.csv' , delimiter = ',')
Y_test = np.loadtxt('labels_test.csv' , delimiter = ',')


X_train = X_train.reshape(len(X_train),100,100,3)
X_test = X_test.reshape(len(X_test),100,100,3)
Y_train = Y_train.reshape(len(Y_train),1)
Y_test = Y_test.reshape(len(Y_test),1)


X_train = X_train / 255.0
X_test = X_test / 255.0


# Model

model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(100,100,3)),
    MaxPooling2D((2, 2)),
    Conv2D(32, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')

])


model.compile(loss = 'binary_crossentropy' , optimizer = 'Adam' , metrics = ['accuracy'])

model.fit(X_train , Y_train , epochs = 5 , batch_size = 64 , validation_data = (X_test , Y_test))

model.evaluate(X_test , Y_test)



#testing 

index = random.randint(0,len(Y_test))
plt.imshow(X_test[index,:])
plt.show()

y_output = model.predict(X_test[index,:].reshape(1,100,100,3))
print(y_output)






