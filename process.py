#!/usr/bin/python

# Usage: process.py <input file> <output file> [-l <Language>] [-pdf|-txt|-rtf|-docx|-xml]

import argparse
import os
import time
import re
import base64
import io

from AbbyyOnlineSdk import *


processor = None

def setup_processor():
	if "ABBYY_APPID" in os.environ:
		processor.ApplicationId = os.environ["ABBYY_APPID"]

	if "ABBYY_PWD" in os.environ:
		processor.Password = os.environ["ABBYY_PWD"]

	# Proxy settings
	if "http_proxy" in os.environ:
		proxy_string = os.environ["http_proxy"]
		print("Using http proxy at {}".format(proxy_string))
		processor.Proxies["http"] = proxy_string

	if "https_proxy" in os.environ:
		proxy_string = os.environ["https_proxy"]
		print("Using https proxy at {}".format(proxy_string))
		processor.Proxies["https"] = proxy_string


# Recognize a file at filePath and save result to resultFilePath
def recognize_file(file_path, result_file_path, language, output_format):
	print("Uploading..")
	settings = ProcessingSettings()
	settings.Language = language
	settings.OutputFormat = output_format
	task = processor.process_image(file_path, settings)
	if task is None:
		print("Error")
		return
	if task.Status == "NotEnoughCredits":
		print("Not enough credits to process the document. Please add more pages to your application's account.")
		return

	print("Id = {}".format(task.Id))
	print("Status = {}".format(task.Status))

	# Wait for the task to be completed
	print("Waiting..")
	# Note: it's recommended that your application waits at least 2 seconds
	# before making the first getTaskStatus request and also between such requests
	# for the same task. Making requests more often will not improve your
	# application performance.
	# Note: if your application queues several files and waits for them
	# it's recommended that you use listFinishedTasks instead (which is described
	# at http://ocrsdk.com/documentation/apireference/listFinishedTasks/).

	while task.is_active():
		time.sleep(5)
		print(".")
		task = processor.get_task_status(task)

	print("Status = {}".format(task.Status))

	if task.Status == "Completed":
		if task.DownloadUrl is not None:
			processor.download_result(task, result_file_path)
			print("Result was written to {}".format(result_file_path))
	else:
		print("Error processing task")
                
def convertPic():
	global processor
	processor = AbbyyOnlineSdk()

	setup_processor()        
        
	if os.path.isfile('pic'):
		recognize_file('pic', 'list', 'English', 'txt')
	else:
		print("No such file: {}".format(source_file))
        
def parseList():
        with io.open('list', 'r', encoding='utf-8') as f:
                lst=f.read()
                lst.rstrip()
        lst = re.split(':\s*|,\s*|;\s*|\.\s*',lst)
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
        picfl='pic'
        with open(picfl, 'wb') as f:
                f.write(imgBin)
        convertPic()
        # there is now a file called 'list' that contains the printed list of ingredients
        return parseList()
def main():
        with open("notBread.png", 'rb') as f:
                imgBin = f.read()
                encodedStr = base64.b64encode(imgBin)
        OCR(encodedStr)
        
if __name__ == "__main__":
	main()
