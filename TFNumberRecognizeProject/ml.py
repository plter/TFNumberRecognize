import numpy as np
import tensorflow as tf

model = tf.keras.models.Sequential([
    tf.keras.layers.Flatten(input_shape=(28, 28)),
    tf.keras.layers.Dense(512, activation=tf.nn.relu),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10, activation=tf.nn.softmax)
])
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)


def recognize(image_data):
    predictions = model.predict(np.array([image_data]))
    first_prediction = predictions[0]
    print(first_prediction)
    index = np.argmax(first_prediction)
    return index


def train(src, dest):
    model.fit(np.array([src]), np.array([dest]))
