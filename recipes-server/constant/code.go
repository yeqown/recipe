package constant

import (
	"encoding/json"
	"fmt"
	"reflect"
)

const (
	CodeOk = iota
	CodeParamRequired
	CodeParamInvalid
	CodeWrongDataType
	CodeUndefinedField

	CodeNoRegMobile
	CodeDupMobile
	CodeWrongPwd

	CodeSystemErr        = 500 + iota
	CodeResponseTimeout  = 503
	CodeNotFound         = 404
	CodeMethodNotAllowed = 405
)

var Messages = map[int]string{
	CodeOk:             "成功",
	CodeParamRequired:  "缺少参数",
	CodeParamInvalid:   "非法参数",
	CodeWrongDataType:  "错误的数据类型",
	CodeUndefinedField: "未定义的字段",

	CodeNoRegMobile: "手机号码尚未注册",
	CodeDupMobile:   "手机号码已经注册",
	CodeWrongPwd:    "密码错误",

	CodeSystemErr:        "系统错误",
	CodeResponseTimeout:  "响应超时",
	CodeNotFound:         "Api未找到",
	CodeMethodNotAllowed: "该方法不允许",
}

var TimeoutJsonResp string

func init() {
	ci := NewCodeInfo(CodeResponseTimeout, "")
	bs, _ := json.Marshal(ci)
	TimeoutJsonResp = string(bs)
}

type CodeInfo struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func NewCodeInfo(code int, message string) *CodeInfo {
	ci := new(CodeInfo)
	if message == "" {
		if m, ok := Messages[code]; !ok {
			panic(FString("code-[%d] undefined", code))
		} else {
			message = m
		}
	}
	ci.Code = code
	ci.Message = message
	return ci
}

/*
 * @i interface{} - interface with field `CodeInfo`
 * @ci *CodeInfo - fill i with this CodeInfo
 */
func Response(i interface{}, ci *CodeInfo) {
	v := reflect.ValueOf(i).Elem()
	// i must be a struct type data
	if v.Kind() != reflect.Struct {
		panic(Messages[CodeWrongDataType])
	}
	// must include field named CodeInfo
	if _, ok := v.Type().FieldByName("CodeInfo"); !ok {
		panic("no field named `CodeInfo`")
	}
	ciField := v.FieldByName("CodeInfo")
	ciField.FieldByName("Code").SetInt(int64(ci.Code))
	ciField.FieldByName("Message").SetString(ci.Message)
}

func FString(format string, v ...interface{}) string {
	return fmt.Sprintf(format, v...)
}
