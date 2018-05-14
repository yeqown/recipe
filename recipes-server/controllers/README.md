## recipes-server.controllers

Necessary Condition:

* 1. Fn prototype `Fn(req *reqType) *respType`
* 2. Add Fn to Route, like this:
```golang
# file: router.router.go, func: RegisterHandler
addRoute(&Route{"/hello", http.MethodPut, ctr.HelloPut, ctr.PoolHelloPutForm, ctr.PoolHelloPutResp})
```
* 3. var **`PoolOfReqType`** and **`PoolOfRespType`** in type **`Sync.Pool`**

Request Method: 

* [Get](#get-method) 
* [Post](#post-method)
* [Put](#put-method)
* [JsonBody](#jsonbody-method)
* [Files](#files-method)

### Get Method

```golang
type HelloGetForm struct {
	Name string `schema:"name" valid:"Required" json:"name"`
	Age  int    `schema:"age" valid:"Required;Min(18)" json:"age"`
}

var PoolHelloGetForm = &sync.Pool{New: func() interface{} { return &HelloGetForm{} }}

type HelloGetResp struct {
	CodeInfo
	Tip string `json:"tip"`
}

var PoolHelloGetResp = &sync.Pool{New: func() interface{} { return &HelloGetResp{} }}

func HelloGet(req *HelloGetForm) *HelloGetResp {
	resp := PoolHelloGetResp.Get().(*HelloGetResp)
	defer PoolHelloGetResp.Put(resp)

	resp.Tip = fmt.Sprintf("Get Hello, %s! your age[%d] is valid to access", req.Name, req.Age)

	Response(resp, NewCodeInfo(CodeOk, ""))
	return resp
}
```

![Get-Method](https://raw.githubusercontent.com/yeqown/recipes-server/master/screenshots/getmethod.png)

### Post Method

```golang
type HelloPostForm struct {
	Name string `schema:"name" valid:"Required" json:"name"`
	Age  int    `schema:"age" valid:"Required;Min(18)" json:"age"`
}

var PoolHelloPostForm = &sync.Pool{New: func() interface{} { return &HelloPostForm{} }}

type HelloPostResp struct {
	CodeInfo
	Tip string `json:"tip"`
}

var PoolHelloPostResp = &sync.Pool{New: func() interface{} { return &HelloPostResp{} }}

func HelloPost(req *HelloPostForm) *HelloPostResp {
	resp := PoolHelloPostResp.Get().(*HelloPostResp)
	defer PoolHelloPostResp.Put(resp)

	resp.Tip = fmt.Sprintf("POST Hello, %s! your age[%d] is valid to access", req.Name, req.Age)

	Response(resp, NewCodeInfo(CodeOk, ""))
	return resp
}
```
![POST-Method](https://raw.githubusercontent.com/yeqown/recipes-server/master/screenshots/postmethod.png)

### Put Method

```golang
type HelloPutForm struct {
	Name string `schema:"name" valid:"Required" json:"name"`
	Age  int    `schema:"age" valid:"Required;Min(18)" json:"age"`
}

var PoolHelloPutForm = &sync.Pool{New: func() interface{} { return &HelloPutForm{} }}

type HelloPutResp struct {
	CodeInfo
	Tip string `json:"tip"`
}

var PoolHelloPutResp = &sync.Pool{New: func() interface{} { return &HelloPutResp{} }}

func HelloPut(req *HelloPutForm) *HelloPutResp {
	resp := PoolHelloPutResp.Get().(*HelloPutResp)
	defer PoolHelloPutResp.Put(resp)

	resp.Tip = fmt.Sprintf("POST Hello, %s! your age[%d] is valid to access", req.Name, req.Age)

	Response(resp, NewCodeInfo(CodeOk, ""))
	return resp
}
```

![Put-Method](https://raw.githubusercontent.com/yeqown/recipes-server/master/screenshots/putmethod.png)

### JSONbody Method

```golang
type HelloJsonBodyForm struct {
	JSON bool   `schema:"-" json:"-"` // this fied set to parse JSON body
	Name string `schema:"name" valid:"Required" json:"name"`
	Age  int    `schema:"age" valid:"Required;Min(0)" json:"age"`
}

var PoolHelloJsonBodyForm = &sync.Pool{New: func() interface{} { return &HelloJsonBodyForm{} }}

type HelloJsonBodyResp struct {
	CodeInfo
	Tip string `json:"tip"`
}

var PoolHelloJsonBodyResp = &sync.Pool{New: func() interface{} { return &HelloJsonBodyResp{} }}

func HelloJsonBody(req *HelloJsonBodyForm) *HelloJsonBodyResp {
	resp := PoolHelloJsonBodyResp.Get().(*HelloJsonBodyResp)
	defer PoolHelloJsonBodyResp.Put(resp)

	resp.Tip = fmt.Sprintf("JSON-Body Hello, %s! your age[%d] is valid to access", req.Name, req.Age)

	Response(resp, NewCodeInfo(CodeOk, ""))
	return resp
}
```

![JSON-Body](https://raw.githubusercontent.com/yeqown/recipes-server/master/screenshots/jsonbody.png)

### Files Method

```golang
type HelloFileForm struct {
	FILES map[string]mw.ParamFile `schema:"-" json:"-"` // must be this name
	Name  string                  `schema:"name" valid:"Required"`
	Age   int                     `schema:"age" valid:"Required"`
}

var PoolHelloFileForm = &sync.Pool{New: func() interface{} { return &HelloFileForm{} }}

type HelloFileResp struct {
	CodeInfo
	Data struct {
		Tip  string `json:"tip"`
		Name string `json:"name"`
		Age  int    `json:"age"`
	} `json:"data"`
}

var PoolHelloFileResp = &sync.Pool{New: func() interface{} { return &HelloFileResp{} }}

func HelloFile(req *HelloFileForm) *HelloFileResp {
	resp := PoolHelloFileResp.Get().(*HelloFileResp)
	defer PoolHelloFileResp.Put(resp)

	resp.Data.Tip = "foo"
	for key, paramFile := range req.FILES {
		AppL.Infof("%s:%s\n", key, paramFile.FileHeader.Filename)
		s, _ := bufio.NewReader(paramFile.File).ReadString(0)
		resp.Data.Tip += s
	}

	resp.Data.Name = req.Name
	resp.Data.Age = req.Age

	Response(resp, NewCodeInfo(CodeOk, ""))
	return resp
}
```

![Files-Form](https://raw.githubusercontent.com/yeqown/recipes-server/master/screenshots/files.png)

```txt
# demo1.txt
你好啊
好吧

# demo2.txt
第二哥文件
line
```
