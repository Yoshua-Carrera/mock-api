const std = @import("std");
const Greeter = @import("greeter.zig").Greeter;

pub const App = struct {
    pub fn run(self: *App) !void {
        _ = self;

        const greeter = Greeter{};
        try greeter.helloWorldWithMemory();
        try greeter.helloWorld();
    }
};
