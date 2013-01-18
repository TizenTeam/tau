<?php
error_reporting(E_ALL);
define ("BASE_PATH",".");
define ("FILES_DIR","logfiles");

class SevFile {

	private $basePath = BASE_PATH;
	private $filesDir = FILES_DIR;
	private $fileName ;
	private $filePath;
	private $fileHandle;

	public function __construct($fileName) {
	    $this->fileName = $fileName;
	    $this->filePath = $this->basePath . DIRECTORY_SEPARATOR . $this->filesDir . DIRECTORY_SEPARATOR;
	}
	public function createFile($writeMode) {
	    if($this->fileHandle = fopen($this->filePath . $this->fileName, $writeMode)) {
			return true;
	    }
		return false;
	}

	public function closeFile(){
	    fclose($this->fileHandle);
	}

	public function writeToFile($dataToInsert) {
	    self::createFile('w');
	    if(fwrite($this->fileHandle , $dataToInsert)) {
	         return true;
	    }
	    self::closeFile();
	    return false;
	}
	public function appendToFile($dataToInsert){
		self::createFile('a');
		if(fwrite($this->fileHandle , $dataToInsert)) {
		return true;
		}
		self::closeFile();
		return false;
	}

	public function readFromFile($bytesToRead = 0){
		self::createFile('r');
		if($bytesToRead > 0) {
			if($result = fread($this->fileHandle , $bytesToRead)) {
				return $result;
			}
		} else {
		if($result = fread($this->fileHandle , filesize($this->filePath . $this->fileName))) {
			return $result;
			}
		}
		self::closeFile();
		return false;
	}
}

?>

<?
	if( $_POST["obj"] &&
		$_POST["currentTest"] )
	{
		$obj = $_POST["obj"];
		$file = new SevFile("log.txt");
		$file->appendToFile( $_POST["currentTest"]."|". $obj["result"] ."|". $obj["actual"] ."|". $obj["expected"] ."|". $obj["message"] ."|". $obj["source"] ."\n" );
		$file->closeFile();
		echo  $_POST["currentTest"]."|". $obj["result"] ."|". $obj["actual"] ."|". $obj["expected"] ."|". $obj["message"] ."|". $obj["source"];
	}else{
		echo "nofile";
	}

	if( $_REQUEST["reset"] )
	{
		$file = new SevFile("log.txt");
		$file->writeToFile("");
		$file->closeFile();
		echo "reset";
	}
?>