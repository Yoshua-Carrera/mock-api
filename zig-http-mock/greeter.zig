const std = @import("std");

pub const Greeter = struct {
    pub fn helloWorld(self: Greeter) !void {
        _ = self;
        std.debug.print("Hello, world!\n", .{});
    }

    pub fn helloWorldWithMemory(self: Greeter) !void {
        _ = self;
        var buffer: [1024]u8 = undefined;

        var file_writer = std.fs.File.stdout().writer(&buffer);
        const stdout = &file_writer.interface;

        try stdout.print("Hello, world with memory!\n", .{});
        try stdout.flush();
    }
};
