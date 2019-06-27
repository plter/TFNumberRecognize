import numpy as np
import tensorflow as tf
import os


def create_model():
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
    return model


checkpoint_path = os.path.join(os.path.dirname(__file__), "training", "cp.ckpt")
checkpoint_dir = os.path.dirname(checkpoint_path)

# Create checkpoint callback
cp_callback = tf.keras.callbacks.ModelCheckpoint(
    checkpoint_path,
    save_weights_only=True,
    verbose=1
)

model = create_model()
latest = tf.train.latest_checkpoint(checkpoint_dir)
model.load_weights(latest)


def recognize(image_data):
    predictions = model.predict(np.array([image_data]))
    first_prediction = predictions[0]
    index = np.argmax(first_prediction)
    return dict(prediction=first_prediction.tolist(), result=int(index))


def train(src, dest):
    model.fit(np.array([src]), np.array([dest]), epochs=10, callbacks=[cp_callback])
