// swift-tools-version: 5.9
import PackageDescription

// PrvioKit — the shared, Foundation-only client layer for the native Apple
// applications (Phase 8). It speaks only to the versioned backend REST API
// (/api/v1), mirroring the web client's "client → backend only" rule. The
// SwiftUI app and WidgetKit extension (see ../App and ../Widget) import this
// package from an Xcode project; keeping it dependency-free keeps it portable
// across iOS, iPadOS, macOS, watchOS and visionOS.
let package = Package(
    name: "PrvioKit",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
        .watchOS(.v10),
        .visionOS(.v1),
    ],
    products: [
        .library(name: "PrvioKit", targets: ["PrvioKit"]),
    ],
    targets: [
        .target(name: "PrvioKit"),
        .testTarget(name: "PrvioKitTests", dependencies: ["PrvioKit"]),
    ]
)
