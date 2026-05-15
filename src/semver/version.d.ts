export class Version {
    /**
     * @param {string|undefined} [version] The version string (ex 1.2.3)
     */
    constructor(version?: string | undefined);
    /**
     * @type {number}
     */
    major: number;
    /**
     * @type {number}
     */
    minor: number;
    /**
     * @type {number}
     */
    patch: number;
    /**
     * @type {(string|number)[]}
     */
    prerelease: (string | number)[];
    /**
     * @type {string[]}
     */
    build: string[];
    /**
     * Increment a version according to a release type.
     * @param {string} release major | minor | patch | premajor | preminor | prepatch | prerelease
     * @param {string|undefined} [preid] Optional prerelease identifier (e.g., 'beta')
     */
    bump(release: string, preid?: string | undefined): void;
    /**
     * Convert the version to a string
     * @returns {string} Version string
     */
    toString(): string;
    toValue(): void;
}
