package customerrors

type CursoConflictError struct {
	Msg string
}

func (e *CursoConflictError) Error() string {
	return e.Msg
}
