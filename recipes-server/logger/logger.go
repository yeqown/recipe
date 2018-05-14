/*
 * logger package selfmade
 * output to stdout or stderr also output to file
 * colorful to enhance you foucsing point
 */

package logger

import (
	// "fmt"
	// "time"
	L "github.com/yeqown/log"
	"path/filepath"
)

var (
	ReqL = L.NewLogger()
	AppL = L.NewLogger()
)

func InitLogger(logPath string) {
	var err error
	if logPath, err = filepath.Abs(logPath); err != nil {
		panic(err)
	}
	AppL.Infof("Init Logger with logPath: %s", logPath)

	// TODO: init a global logger instance, so that can log anywhere
	// and cant output to console and file both
	// file can be splited day by day format like "app.20180412.log"
	AppL.SetFileOutput(logPath, "app")
	ReqL.SetFileOutput(logPath, "request")
}
