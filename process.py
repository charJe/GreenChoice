#!/usr/bin/python
import argparse
import os
import time
import re
import base64
import io

from pytesser import *
from PIL import Image

processor = None
# access the 'pic.png' file
# returns an unrefined string of ingredients
def convertPic():
      	if os.path.isfile('pic.png'):
                print ("Looking at picture...")
                # actualy OCR here, currently trying tesseract with pytesser
                im=Image.open('pic.png')
                text=image_to_string(im)
                text=image_file_to_string('pic.png')
                text=image_file_to_string('pic.png',graceful_errors=True)
                print ("Done reading picture")
                print(text)
                return (text)
        
def parseList( text):
        lst = re.split(':\s*|,\s*|;\s*|\.\s*',text)
        oilMode=False
        for i in range(len(lst)):
                if '(' in lst[i] and ')' in lst[i]:
                        lst[i] = lst[i][:lst[i].index('(')]
                if '(' in lst[i] and ')' not in lst[i]:
                        biggerIngre=re.split('\(', lst[i], re.I)
                        if "OIL" in biggerIngre[0]: # this is a list of oils
                                oilMode=True
                                lst[i]=biggerIngre[1]+" OIL"
                        else:           # this is a list of sub ingridients
                                lst[i]=biggerIngre[1];
                elif ')' in lst[i]:
                        lst[i] = lst[i][:(len(lst[i])-1)]
                        if oilMode:
                                lst[i]=lst[i]+" OIL"
                        oilMode=False
                #fix the problem caused by new lines and spaces in the middle of ingredients
                if '\r\n' in lst[i]:
                        lst[i]=lst[i].replace(" ","")
                        lst[i]=lst[i].replace("\r\n", " ")
                if '\n' in lst[i]:
                        lst[i]=lst[i].replace(" ","")
                        lst[i]=lst[i].replace("\n", " ")
                if oilMode:
                        lst[i]=lst[i]+" OIL"
        return lst
def OCR( encoded64Pic ):
        imgBin = base64.b64decode(encoded64Pic)
        picfl='pic.png'
        with open(picfl, 'wb') as f:
                f.write(imgBin)
                # there is now an image file called pic
        try:                               
                return parseList( convertPic())
        except:
                print ("OCR failed")
                return ("Picture quality is too low, or picture needs to be cropped\n")
                
def main():
        #with open("notBread.png", 'rb') as f:
        #        imgBin = f.read()
        #        encodedStr = base64.b64encode(imgBin)
        #OCR(encodedStr)
        # directly tries OCR on 'pic'
        try:
                print (parseList( convertPic()))
        except:
                print ("OCR failed")
                return ("Picture quality is too low, or picture needs to be cropped\n")
        
if __name__ == "__main__":
	main()
