export class Repository {
    /** @type { string } */
    static cwd: string;
    /**
     * Git add/stage the following files
     * @param {string[]} files Files to add
     * @param {string} [cwd] Current Working Directory
     * @returns {string} Returns stdout/stderr output
     */
    static add(files: string[], cwd?: string): string;
    /**
     * Git commit
     * @param {string} message Commit message
     * @param {string} [cwd] Current working directory
     * @returns {string} Returns stdout/stderr output
     */
    static commit(message: string, cwd?: string): string;
    /**
     * Is the git working tree clean of uncommitted changes?
     * @param {string} [cwd] Current working directory
     * @returns {boolean} Returns true if the working tree is clean, otherwise false
     */
    static isWorkingTreeClean(cwd?: string): boolean;
    /**
     * Git latest release tag
     * @param {string} [cwd] Current working directory
     * @returns {string} Latest release tag (default v0.0.0)
     */
    static latestRelease(cwd?: string): string;
    /**
     * Git origin URL
     * @param {string} [cwd] Current working directory
     * @returns {string} the repository name
     */
    static url(cwd?: string): string;
    /**
     * Git tag
     * @param {string} release Release version
     * @param {string} message Commit message
     * @param {string} cwd Current working directory
     * @returns {string} Returns stdout/stderr output
     */
    static tag(release: string, message: string, cwd?: string): string;
}
