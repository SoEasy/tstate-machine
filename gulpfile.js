const gulp = require("gulp");
const tsb = require("gulp-tsb");
const rename = require("gulp-rename");

const project = tsb.create("tsconfig.json");

gulp.task("build", () => gulp
    .src(["./src/StateMachine.ts"])
    .pipe(project())
    .pipe(gulp.dest("."))
);
