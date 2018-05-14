package utils

import (
	"testing"
)

func Test_StringEncMd5(t *testing.T) {
	hex := StringEncMd5("hahahah")
	t.Log(hex)
}

func xTest_UniqueId(t *testing.T) {
	idMap := map[string]byte{}
	var total, conflictCnt, emptyCnt int = 10000000, 0, 0

	for i := 0; i < total; i++ {
		id := UniqueId()
		if id == "" {
			t.Error("empty id got")
			emptyCnt++
			continue
		}
		if _, ok := idMap[id]; ok {
			t.Error("conflict", id)
			conflictCnt++
			continue
		}
		idMap[id] = '0'
	}

	t.Logf("Total: %d, Empty: %d, Conflict: %d\n", total, emptyCnt, conflictCnt)
}
