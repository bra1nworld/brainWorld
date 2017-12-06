import * as Leaf from "leaf-ts"
export const Errors = Leaf.ErrorDoc.build({
    UnknownError: {},
    InvalidParameter: {},
    AlreadyExists: {},
    Forbidden: {},
    NotFound: {},
    AuthorizationFailed: {},
    EndOfProcedure: {},
    StartOfProcedure: {},
    BrokenFile: {}
})
