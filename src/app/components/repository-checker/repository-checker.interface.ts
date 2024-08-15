export interface RespositoryCheckerResponse {
    result: {
        data: {
            hasError: boolean

            /// Debian
            isDebianBased: boolean
            repositoryCheckerExists: boolean
            RepositoryCheckerExistsError: string
            repositoryCheckerIsReadable: boolean
            repositoryCheckerIsReadableError: string
            RepositoryCheckerIsReadableSourcesList: string
            isOldRepositoryInUse: boolean
            isOldRepositoryInUseError: string,


            /// RHEL
            isRhelBased: boolean;
            dnfRepositoryCheckerExists: boolean
            dnfRepositoryCheckerExistsError: string
            dnfRepositoryIsReadable: boolean
            dnfRepositoryIsReadableError: string
            dnfRepositoryRepoConfig: string
        }
    }
    _csrfToken: string
}
