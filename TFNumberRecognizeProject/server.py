import json
import os

import numpy as np
import tornado.ioloop
import tornado.web

import ml


class TrainHandler(tornado.web.RequestHandler):
    def post(self):
        if 'data' in self.request.arguments:
            data_str = self.get_argument('data')
            data = json.loads(data_str)
            photo_data = data['photo_data']
            np_photo_data = ((255 - np.array(photo_data, dtype=np.uint8)) / 255.0).reshape(28, 28)
            target_num = data['num']

            ml.train(np_photo_data, target_num)
            self.write('OK')
        else:
            self.write("Argument error")


class RecognizeHandler(tornado.web.RequestHandler):
    def post(self):
        if 'data' in self.request.arguments:
            data_str = self.get_argument('data')
            data = json.loads(data_str)
            photo_data = data['photo_data']
            np_photo_data = ((255 - np.array(photo_data, dtype=np.uint8)) / 255.0).reshape(28, 28)

            result = ml.recognize(np_photo_data)
            self.write(f"{result}")
        else:
            self.write("Argument error")


def make_app():
    return tornado.web.Application(
        [
            (r"/train", TrainHandler),
            (r"/recognize", RecognizeHandler),
        ],
        static_path=os.path.join(os.path.dirname(__file__), "static")
    )


if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
