import numpy as np 
import sys, os
import json
import cv2
from fastai.vision.all import *

#This code is for the fastai V2 library
class saveEachEpoch(Callback):
    def after_epoch(self):
        return true
        
dir_path = os.path.dirname(os.path.realpath(__file__));
learn = load_learner('./models/export_256_9143');
classes = learn.data.vocab

def apply_FFT_transform(input_image_path):
    img = cv2.imread(input_image_path)
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dft = cv2.dft(np.float32(img_gray), flags = cv2.DFT_COMPLEX_OUTPUT)
    dft_shift = np.fft.fftshift(dft)
    magnitude_spectrum = 10*np.log(cv2.magnitude(dft_shift[:,:,0], dft_shift[:,:,1]))
    magnitude_spectrum[magnitude_spectrum < 0] = 0
    return cv2.resize(magnitude_spectrum, (256,256), interpolation = cv2.INTER_AREA)

def img2d_3d(input_image):
    output_image = np.zeros((input_image.shape[0],input_image.shape[1], 3), dtype=np.uint8)
    output_image[:,:,0] = input_image
    output_image[:,:,1] = input_image
    output_image[:,:,2] = input_image
    return output_image

im_path = dir_path + '/' + sys.argv[1]
im_path = im_path.replace('\\', '/')

img_fft = apply_FFT_transform(im_path)

img_3d = img2d_3d(img_fft)

pred = learn.predict(PILImage.create(img_3d))
print({c: round(float(pred[2][i]), 5) for (i, c) in enumerate(classes)})