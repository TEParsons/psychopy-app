<div class=container>
    <nav>
        <a href="/builder">
            <svg>
                <use xlink:href="/icons/btn-builder.svg"></use>
            </svg>
            Builder
        </a>
        <a href="/coder">
            <svg>
                <use xlink:href="/icons/btn-coder.svg"></use>
            </svg>
            Coder
        </a>
        <a href="/runner">
            <svg>
                <use xlink:href="/icons/btn-runner.svg"></use>
            </svg>
            Runner
        </a>
    </nav>
</div>

<style>
.container {
    position: relative;
    width: 100%;
    height: 100%;
}
nav {
    position: relative;
    display: flex;
    flex-direction: row;
    margin: 4rem auto;
    gap: 2rem;
    justify-content: center;
}
nav a {
    position: relative;
    width: 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
}
</style>