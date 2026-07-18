const App = @import("app.zig").App;

pub fn main() !void {
    var app = App{};
    try app.run();
}
