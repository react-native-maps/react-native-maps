# Changelog

## [1.25.3](https://github.com/react-native-maps/react-native-maps/compare/v1.25.2...v1.25.3) (2025-08-09)


### Bug Fixes

* **android:** showsMyLocationButton not working ([#5687](https://github.com/react-native-maps/react-native-maps/issues/5687)) ([009c7e6](https://github.com/react-native-maps/react-native-maps/commit/009c7e60c27d7d67ed853bd6da170730af769ef2))

## [1.25.2](https://github.com/react-native-maps/react-native-maps/compare/v1.25.1...v1.25.2) (2025-08-09)


### Bug Fixes

* **ios:** googlemaps mylocation compass ([#5686](https://github.com/react-native-maps/react-native-maps/issues/5686)) ([e43862d](https://github.com/react-native-maps/react-native-maps/commit/e43862dc19f0a2904202365516250701284b19d0))

## [1.25.1](https://github.com/react-native-maps/react-native-maps/compare/v1.25.0...v1.25.1) (2025-08-09)


### Reverts

* Revert "Fix/googlemaps mylocation compass" ([#5685](https://github.com/react-native-maps/react-native-maps/issues/5685)) ([0126fbe](https://github.com/react-native-maps/react-native-maps/commit/0126fbe03cb838a8a370314e1c96404e31a312bc)), closes [#5684](https://github.com/react-native-maps/react-native-maps/issues/5684)

# [1.25.0](https://github.com/react-native-maps/react-native-maps/compare/v1.24.16...v1.25.0) (2025-08-03)


### Features

* **android:** support saving view state ([#5665](https://github.com/react-native-maps/react-native-maps/issues/5665)) ([2369b64](https://github.com/react-native-maps/react-native-maps/commit/2369b64722bcb27f3f2b5e4def6156f6c0743d7e))

## [1.24.16](https://github.com/react-native-maps/react-native-maps/compare/v1.24.15...v1.24.16) (2025-08-03)


### Bug Fixes

* **android:** fix NPE crash on destroy ([#5664](https://github.com/react-native-maps/react-native-maps/issues/5664)) ([14adf87](https://github.com/react-native-maps/react-native-maps/commit/14adf877ba296d84147583f8c08ae62c9ff4c7b8))

## [1.24.15](https://github.com/react-native-maps/react-native-maps/compare/v1.24.14...v1.24.15) (2025-08-02)


### Bug Fixes

* **android:** crash android react 19 parallel features ([#5662](https://github.com/react-native-maps/react-native-maps/issues/5662)) ([5abb073](https://github.com/react-native-maps/react-native-maps/commit/5abb0739fe08c56fc3b513566ee8b41581bcb1c4))

## [1.24.14](https://github.com/react-native-maps/react-native-maps/compare/v1.24.13...v1.24.14) (2025-08-02)


### Reverts

* Revert "Bug/react 19 parallel features" ([#5661](https://github.com/react-native-maps/react-native-maps/issues/5661)) ([e086144](https://github.com/react-native-maps/react-native-maps/commit/e0861445d9958d78194f2c8e506dbde3a9ab1f25)), closes [#5660](https://github.com/react-native-maps/react-native-maps/issues/5660)

## [1.24.13](https://github.com/react-native-maps/react-native-maps/compare/v1.24.12...v1.24.13) (2025-07-26)


### Bug Fixes

* Add typescript type info for showsTraffic property in MapView.tsx ([#5576](https://github.com/react-native-maps/react-native-maps/issues/5576)) ([4f0abe3](https://github.com/react-native-maps/react-native-maps/commit/4f0abe33fc56b517e3cc9e0147c5f7f0003e4028))

## [1.24.12](https://github.com/react-native-maps/react-native-maps/compare/v1.24.11...v1.24.12) (2025-07-26)


### Bug Fixes

* fixed nullpointer due null react view tag ([#5630](https://github.com/react-native-maps/react-native-maps/issues/5630)) ([8c8c3ba](https://github.com/react-native-maps/react-native-maps/commit/8c8c3bab7582e16a5add8e59e86911501e412c26))

## [1.24.11](https://github.com/react-native-maps/react-native-maps/compare/v1.24.10...v1.24.11) (2025-07-26)


### Bug Fixes

* **android:** onRegionChangeComplete on initial map loaded ([#5648](https://github.com/react-native-maps/react-native-maps/issues/5648)) ([13648e9](https://github.com/react-native-maps/react-native-maps/commit/13648e9325b02abe1628aa4fbed44b975c05206e))

## [1.24.10](https://github.com/react-native-maps/react-native-maps/compare/v1.24.9...v1.24.10) (2025-07-21)


### Bug Fixes

* **android:** polygon stroke width ([#5617](https://github.com/react-native-maps/react-native-maps/issues/5617)) ([0a76e12](https://github.com/react-native-maps/react-native-maps/commit/0a76e128d3e9968d23bc9f60f7f6f35fe3235291))

## [1.24.9](https://github.com/react-native-maps/react-native-maps/compare/v1.24.8...v1.24.9) (2025-07-21)


### Bug Fixes

* **android:** tracksViewChanges ([#5626](https://github.com/react-native-maps/react-native-maps/issues/5626)) ([478f935](https://github.com/react-native-maps/react-native-maps/commit/478f93554ac21d7081e9865b492971d3efe54fb7))

## [1.24.8](https://github.com/react-native-maps/react-native-maps/compare/v1.24.7...v1.24.8) (2025-07-20)


### Bug Fixes

* **ios:** map props ([#5633](https://github.com/react-native-maps/react-native-maps/issues/5633)) ([581200a](https://github.com/react-native-maps/react-native-maps/commit/581200a4de584d39a45e285f316faf88d2e9f775))

## [1.24.7](https://github.com/react-native-maps/react-native-maps/compare/v1.24.6...v1.24.7) (2025-07-18)


### Bug Fixes

* **createFabricMap:** replace ElementRef with ComponentRef for strict TypeScript compatibility ([#5620](https://github.com/react-native-maps/react-native-maps/issues/5620)) ([f50b7f5](https://github.com/react-native-maps/react-native-maps/commit/f50b7f514d285a38dde4afbd0cdb8ff3bee54894))

## [1.24.6](https://github.com/react-native-maps/react-native-maps/compare/v1.24.5...v1.24.6) (2025-07-18)


### Bug Fixes

* region update events ([#5622](https://github.com/react-native-maps/react-native-maps/issues/5622)) ([08ae3bc](https://github.com/react-native-maps/react-native-maps/commit/08ae3bcf3f9d73fc3c88c1f38c140090b50b20cf))

## [1.24.5](https://github.com/react-native-maps/react-native-maps/compare/v1.24.4...v1.24.5) (2025-07-13)


### Bug Fixes

* **ios:** view modules not found ([#5612](https://github.com/react-native-maps/react-native-maps/issues/5612)) ([9b8b568](https://github.com/react-native-maps/react-native-maps/commit/9b8b5687ee6f1a16acdf15f2cc028fe18898eefc))

## [1.24.4](https://github.com/react-native-maps/react-native-maps/compare/v1.24.3...v1.24.4) (2025-07-13)


### Bug Fixes

* **ios:** polyline fillColor not implemented ([#5614](https://github.com/react-native-maps/react-native-maps/issues/5614)) ([5a2ab35](https://github.com/react-native-maps/react-native-maps/commit/5a2ab355e249369591c85d16fd46eb578901fd12))

## [1.24.3](https://github.com/react-native-maps/react-native-maps/compare/v1.24.2...v1.24.3) (2025-06-09)


### Bug Fixes

* **android:** fix NPE crash on pause ([#5555](https://github.com/react-native-maps/react-native-maps/issues/5555)) ([ae8d38c](https://github.com/react-native-maps/react-native-maps/commit/ae8d38c672e1671ea53f28336b11fbbb139e861f))

## [1.24.2](https://github.com/react-native-maps/react-native-maps/compare/v1.24.1...v1.24.2) (2025-06-09)


### Bug Fixes

* **ios:** googleMaps marker images not visible ([#5554](https://github.com/react-native-maps/react-native-maps/issues/5554)) ([1924954](https://github.com/react-native-maps/react-native-maps/commit/19249543e9da1cbfdf2035964e232a458c562e64))

## [1.24.1](https://github.com/react-native-maps/react-native-maps/compare/v1.24.0...v1.24.1) (2025-06-08)


### Bug Fixes

* **AppleMaps:** polygon strokeWidth ([#5549](https://github.com/react-native-maps/react-native-maps/issues/5549)) ([c2addb5](https://github.com/react-native-maps/react-native-maps/commit/c2addb5830a6097d8818a93cd865dbf549e83569))

# [1.24.0](https://github.com/react-native-maps/react-native-maps/compare/v1.23.12...v1.24.0) (2025-06-08)


### Features

* **AppleMaps:** add support for centerOffset for Marker ([#5548](https://github.com/react-native-maps/react-native-maps/issues/5548)) ([73ab17d](https://github.com/react-native-maps/react-native-maps/commit/73ab17dc73f60bd51423f8161843455c23827cc9))

## [1.23.12](https://github.com/react-native-maps/react-native-maps/compare/v1.23.11...v1.23.12) (2025-06-08)


### Bug Fixes

* **android:** custom markers size always 100 ([#5103](https://github.com/react-native-maps/react-native-maps/issues/5103)) ([05a2293](https://github.com/react-native-maps/react-native-maps/commit/05a22938fdf2987b8e14bd872f7cb102cf1c261c))

## [1.23.11](https://github.com/react-native-maps/react-native-maps/compare/v1.23.10...v1.23.11) (2025-06-08)


### Bug Fixes

* **android:** Marker re-render performance improvements  ([#5545](https://github.com/react-native-maps/react-native-maps/issues/5545)) ([9ec75e2](https://github.com/react-native-maps/react-native-maps/commit/9ec75e2872c194d9c1c86a19e9bc88b0cc6ee3cd))

## [1.23.10](https://github.com/react-native-maps/react-native-maps/compare/v1.23.9...v1.23.10) (2025-06-07)


### Bug Fixes

* correctly emit marker-press event for Android ([#5514](https://github.com/react-native-maps/react-native-maps/issues/5514)) ([d9d24bf](https://github.com/react-native-maps/react-native-maps/commit/d9d24bf1dd0e64616fbe623d0c94ca9943667555))

## [1.23.9](https://github.com/react-native-maps/react-native-maps/compare/v1.23.8...v1.23.9) (2025-06-07)


### Bug Fixes

* improve TypeScript compatibility and error reporting ([7d53f71](https://github.com/react-native-maps/react-native-maps/commit/7d53f7109da4b577a0fee7e9e76c3aa4bdebb74f))

## [1.23.8](https://github.com/react-native-maps/react-native-maps/compare/v1.23.7...v1.23.8) (2025-05-13)


### Bug Fixes

* re-add support for verbatimModuleSyntax ([#5453](https://github.com/react-native-maps/react-native-maps/issues/5453)) ([c12b2b5](https://github.com/react-native-maps/react-native-maps/commit/c12b2b5148657ee1d471981ef711526715a73fc2))

## [1.23.7](https://github.com/react-native-maps/react-native-maps/compare/v1.23.6...v1.23.7) (2025-05-05)


### Bug Fixes

* **iOS:** appleMap module calls ([a0ba286](https://github.com/react-native-maps/react-native-maps/commit/a0ba2868c47936d6456ec97e5cfecdb1f6a6432d))
* **iOS:** appleMap module calls ([771accb](https://github.com/react-native-maps/react-native-maps/commit/771accbe013b5b17f28eda68274b73880a589363))

## [1.23.6](https://github.com/react-native-maps/react-native-maps/compare/v1.23.5...v1.23.6) (2025-05-05)


### Bug Fixes

* Fabric Android fixes ([#5484](https://github.com/react-native-maps/react-native-maps/issues/5484)) ([f3b9b7d](https://github.com/react-native-maps/react-native-maps/commit/f3b9b7d7f905f40779c64e9310f7621239b9e073))

## [1.23.5](https://github.com/react-native-maps/react-native-maps/compare/v1.23.4...v1.23.5) (2025-05-05)


### Bug Fixes

* **ts:** more fixes for ts issues ([#5483](https://github.com/react-native-maps/react-native-maps/issues/5483)) ([7827e13](https://github.com/react-native-maps/react-native-maps/commit/7827e130eda0cf27d425891651540618b2e52b5f))

## [1.23.4](https://github.com/react-native-maps/react-native-maps/compare/v1.23.3...v1.23.4) (2025-05-05)


### Bug Fixes

* **expo:** update plugin to use new podspec ([#5482](https://github.com/react-native-maps/react-native-maps/issues/5482)) ([7a6006a](https://github.com/react-native-maps/react-native-maps/commit/7a6006abee68f0ebfe9cdf58a7829b381bbbfd76))

## [1.23.3](https://github.com/react-native-maps/react-native-maps/compare/v1.23.2...v1.23.3) (2025-05-05)


### Bug Fixes

* re-add support for strictNullChecks ([#5454](https://github.com/react-native-maps/react-native-maps/issues/5454)) ([b861468](https://github.com/react-native-maps/react-native-maps/commit/b861468e0b43c4d180138ac9ac2e7bbfb075854d))

## [1.23.2](https://github.com/react-native-maps/react-native-maps/compare/v1.23.1...v1.23.2) (2025-05-03)


### Bug Fixes

* **android:** onRegionChange not being dispatched ([#5474](https://github.com/react-native-maps/react-native-maps/issues/5474)) ([6492771](https://github.com/react-native-maps/react-native-maps/commit/649277195dd6e49c37ecc072717ce7b46a0145bc))

## [1.23.1](https://github.com/react-native-maps/react-native-maps/compare/v1.23.0...v1.23.1) (2025-05-03)


### Bug Fixes

* remove unnecessary tsconfig.json from example ([#5473](https://github.com/react-native-maps/react-native-maps/issues/5473)) ([b1d3b5a](https://github.com/react-native-maps/react-native-maps/commit/b1d3b5a0f2317d30e025381e91cfeda0d2023869))

# [1.23.0](https://github.com/react-native-maps/react-native-maps/compare/v1.22.6...v1.23.0) (2025-05-03)


### Bug Fixes

* ts-import for decorateMapComponent ([#5472](https://github.com/react-native-maps/react-native-maps/issues/5472)) ([92ab5ea](https://github.com/react-native-maps/react-native-maps/commit/92ab5ea6787a07d02a0081a9334d51505d3882bc))


### Features

* monorepo to fix auto-linking for example and other issues ([4f70604](https://github.com/react-native-maps/react-native-maps/commit/4f7060414125c56d351876557fdd92bdb1589e74))
* monorepo to fix auto-linking for example and other issues ([9f4ebc5](https://github.com/react-native-maps/react-native-maps/commit/9f4ebc58c740ca3db1d0e3db2c63a03eb0bfada8))
* monorepo to fix auto-linking for example and other issues ([0d12b70](https://github.com/react-native-maps/react-native-maps/commit/0d12b704ac5ede60312a44142e507c1d9b095056))
* monorepo to fix auto-linking for example and other issues ([2144f28](https://github.com/react-native-maps/react-native-maps/commit/2144f28ec80fae47e91c22c8c2eedc48ecaa7192))
* monorepo to fix auto-linking for example and other issues ([81a7008](https://github.com/react-native-maps/react-native-maps/commit/81a70085c5fe9f3bdc35769ffae9bcad49baca18))
* monorepo to fix auto-linking for example and other issues ([bd268a8](https://github.com/react-native-maps/react-native-maps/commit/bd268a803fc21b3825f113fa59d0849bf0934993))
* monorepo to fix auto-linking for example and other issues ([7234a73](https://github.com/react-native-maps/react-native-maps/commit/7234a73a1c2c95b70351201e709b92d971ce2c84))
* monorepo to fix auto-linking for example and other issues ([66c1616](https://github.com/react-native-maps/react-native-maps/commit/66c1616759186ba5f143182757362aa33083280d))
* monorepo to fix auto-linking for example and other issues ([2083a7e](https://github.com/react-native-maps/react-native-maps/commit/2083a7e8286f404cb9736b8f4b1f6587d4c0aa5f))
* revert monorepo ([#5471](https://github.com/react-native-maps/react-native-maps/issues/5471)) ([8c4fab3](https://github.com/react-native-maps/react-native-maps/commit/8c4fab399ced96b0a4b4df6621276006590d82b5))
* update push.yml ([#5459](https://github.com/react-native-maps/react-native-maps/issues/5459)) ([0891663](https://github.com/react-native-maps/react-native-maps/commit/08916637c0a9948f177b282270e8aee157e2b3f4))

# [1.23.0](https://github.com/react-native-maps/react-native-maps/compare/v1.22.6...v1.23.0) (2025-05-03)


### Features

* monorepo to fix auto-linking for example and other issues ([4f70604](https://github.com/react-native-maps/react-native-maps/commit/4f7060414125c56d351876557fdd92bdb1589e74))
* monorepo to fix auto-linking for example and other issues ([9f4ebc5](https://github.com/react-native-maps/react-native-maps/commit/9f4ebc58c740ca3db1d0e3db2c63a03eb0bfada8))
* monorepo to fix auto-linking for example and other issues ([0d12b70](https://github.com/react-native-maps/react-native-maps/commit/0d12b704ac5ede60312a44142e507c1d9b095056))
* monorepo to fix auto-linking for example and other issues ([2144f28](https://github.com/react-native-maps/react-native-maps/commit/2144f28ec80fae47e91c22c8c2eedc48ecaa7192))
* monorepo to fix auto-linking for example and other issues ([81a7008](https://github.com/react-native-maps/react-native-maps/commit/81a70085c5fe9f3bdc35769ffae9bcad49baca18))
* monorepo to fix auto-linking for example and other issues ([bd268a8](https://github.com/react-native-maps/react-native-maps/commit/bd268a803fc21b3825f113fa59d0849bf0934993))
* monorepo to fix auto-linking for example and other issues ([7234a73](https://github.com/react-native-maps/react-native-maps/commit/7234a73a1c2c95b70351201e709b92d971ce2c84))
* monorepo to fix auto-linking for example and other issues ([66c1616](https://github.com/react-native-maps/react-native-maps/commit/66c1616759186ba5f143182757362aa33083280d))
* monorepo to fix auto-linking for example and other issues ([2083a7e](https://github.com/react-native-maps/react-native-maps/commit/2083a7e8286f404cb9736b8f4b1f6587d4c0aa5f))
* revert monorepo ([#5471](https://github.com/react-native-maps/react-native-maps/issues/5471)) ([8c4fab3](https://github.com/react-native-maps/react-native-maps/commit/8c4fab399ced96b0a4b4df6621276006590d82b5))
* update push.yml ([#5459](https://github.com/react-native-maps/react-native-maps/issues/5459)) ([0891663](https://github.com/react-native-maps/react-native-maps/commit/08916637c0a9948f177b282270e8aee157e2b3f4))

# [1.25.0-alpha.8](https://github.com/react-native-maps/react-native-maps/compare/v1.25.0-alpha.7...v1.25.0-alpha.8) (2025-05-03)


### Bug Fixes

* minor version bump semantic-release ([166c008](https://github.com/react-native-maps/react-native-maps/commit/166c0086ab6551c82b4f64985c6adfadbbe004fb))

# [1.25.0-alpha.7](https://github.com/react-native-maps/react-native-maps/compare/v1.25.0-alpha.6...v1.25.0-alpha.7) (2025-05-03)


### Bug Fixes

* force new release ([c309dfa](https://github.com/react-native-maps/react-native-maps/commit/c309dfab18569fe49c986d14351b24432ae14b53))
* force new release ([3f56673](https://github.com/react-native-maps/react-native-maps/commit/3f56673092c3b5d960ce6f91c6053d5d43958ceb))
* force new release ([7d16375](https://github.com/react-native-maps/react-native-maps/commit/7d163759b01b11431f12b9ead6b9944739795815))
* force new release ([5bf2f24](https://github.com/react-native-maps/react-native-maps/commit/5bf2f2418d89dfbb060f9ee8277165d4d87bca69))
* force new release ([2a1722a](https://github.com/react-native-maps/react-native-maps/commit/2a1722ad0f73a29a39b2d74f536f2f058b18c2f6))
* force new release ([8eaecbb](https://github.com/react-native-maps/react-native-maps/commit/8eaecbbe6c45dc914441b6068625a4a03dc1589b))
* force new release ([e095a63](https://github.com/react-native-maps/react-native-maps/commit/e095a636de22733f0e908375604b6a61c9b9cd90))
* force new release ([bd6d242](https://github.com/react-native-maps/react-native-maps/commit/bd6d242692d168f42e4fb9fc6b1df0f25f01d346))
* force new release ([14cc326](https://github.com/react-native-maps/react-native-maps/commit/14cc326ca82c2a83db7a82b9bef1819279b877b5))
* force new release ([55a5e70](https://github.com/react-native-maps/react-native-maps/commit/55a5e708091a621394fd67e791980e2807184358))
* force new release ([f949d2a](https://github.com/react-native-maps/react-native-maps/commit/f949d2abcc192ee658a978c6bf88d9f1a83c3f72))
* force new release ([514cf78](https://github.com/react-native-maps/react-native-maps/commit/514cf78e6e59cd6c182d1d35cff5badb387f1b39))
* force new release ([06e997b](https://github.com/react-native-maps/react-native-maps/commit/06e997bbb949e538ad64344582453950153b08ef))
* force new release ([ea8e54c](https://github.com/react-native-maps/react-native-maps/commit/ea8e54c643910e1b5ffc1978823616112876b3e6))
* force new release ([398be4c](https://github.com/react-native-maps/react-native-maps/commit/398be4ced909116737e982c3345693970f185faa))
* force new release ([dfa2fa5](https://github.com/react-native-maps/react-native-maps/commit/dfa2fa5ed60bb5ec234ed572f18e23834b85f775))
* revert from monorepo ([3fcd5b5](https://github.com/react-native-maps/react-native-maps/commit/3fcd5b573ab318723a48a73c1fd56e233702539d))

## [1.22.6](https://github.com/react-native-maps/react-native-maps/compare/v1.22.5...v1.22.6) (2025-04-21)


### Bug Fixes

* revert to working generated podspec ([#5439](https://github.com/react-native-maps/react-native-maps/issues/5439)) ([9e767cd](https://github.com/react-native-maps/react-native-maps/commit/9e767cd87ea8edc4dae206d89ce143fac737a929))

## [1.22.5](https://github.com/react-native-maps/react-native-maps/compare/v1.22.4...v1.22.5) (2025-04-20)


### Bug Fixes

* simplified generated podspec to pass lint ([#5434](https://github.com/react-native-maps/react-native-maps/issues/5434)) ([a13bf5e](https://github.com/react-native-maps/react-native-maps/commit/a13bf5e70afbe4c24660ebfa4808bd62c9160763))

## [1.22.4](https://github.com/react-native-maps/react-native-maps/compare/v1.22.3...v1.22.4) (2025-04-20)


### Bug Fixes

* simplified generated podspec to pass lint ([#5433](https://github.com/react-native-maps/react-native-maps/issues/5433)) ([faab387](https://github.com/react-native-maps/react-native-maps/commit/faab3871a9e970e4a6b1eee8f3d47158953a96f1))

## [1.22.3](https://github.com/react-native-maps/react-native-maps/compare/v1.22.2...v1.22.3) (2025-04-20)


### Bug Fixes

* simplified generated podspec to pass lint ([#5432](https://github.com/react-native-maps/react-native-maps/issues/5432)) ([582db46](https://github.com/react-native-maps/react-native-maps/commit/582db463529ffcd68f96e9a0595f9360f75b9e0b))

## [1.22.2](https://github.com/react-native-maps/react-native-maps/compare/v1.22.1...v1.22.2) (2025-04-20)


### Bug Fixes

* attempt to publish generated pod to trunk ([#5431](https://github.com/react-native-maps/react-native-maps/issues/5431)) ([7d0d9db](https://github.com/react-native-maps/react-native-maps/commit/7d0d9dbfcd5045d313c5cb048c31c652e7e8acc7))

## [1.22.1](https://github.com/react-native-maps/react-native-maps/compare/v1.22.0...v1.22.1) (2025-04-16)


### Bug Fixes

* Mapview - onLongPress & fabrice Type ([#5420](https://github.com/react-native-maps/react-native-maps/issues/5420)) ([de464a0](https://github.com/react-native-maps/react-native-maps/commit/de464a0915e84e2c6967f65185a073f060df9012))

# [1.22.0](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0...v1.22.0) (2025-04-15)


### Features

* add Expo config plugin ([#5409](https://github.com/react-native-maps/react-native-maps/issues/5409)) ([5a93956](https://github.com/react-native-maps/react-native-maps/commit/5a939565c23ffa5f40b963b19e1a3f9631958756))

# [1.21.0](https://github.com/react-native-maps/react-native-maps/compare/v1.20.1...v1.21.0) (2025-04-11)


### Features

* major release for react-native-maps (Fabric Support !) ([cbb3170](https://github.com/react-native-maps/react-native-maps/commit/cbb3170804d09f06b83ef7d6ea70c85760368b4b))

# [1.21.0-alpha.146](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.145...v1.21.0-alpha.146) (2025-04-11)


### Bug Fixes

* **ios:** fabric framework build works ([e8f7174](https://github.com/react-native-maps/react-native-maps/commit/e8f71749e268476d2e4c9bb0a7163cb811926082))

# [1.21.0-alpha.145](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.144...v1.21.0-alpha.145) (2025-04-11)


### Bug Fixes

* **ios:** fabric non-framework build works ([2cd5b05](https://github.com/react-native-maps/react-native-maps/commit/2cd5b054ec96c20c44b772be40f04b885f83f676))

# [1.21.0-alpha.144](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.143...v1.21.0-alpha.144) (2025-04-11)


### Bug Fixes

* **ios:** fabric non-framework build works ([ada7cc4](https://github.com/react-native-maps/react-native-maps/commit/ada7cc4bbc2bfcf4df2adc1a3ed8bcee06f6cdd8))

# [1.21.0-alpha.143](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.142...v1.21.0-alpha.143) (2025-04-10)


### Bug Fixes

* **android:** fabric mapPadding causes crash ([bf1f9af](https://github.com/react-native-maps/react-native-maps/commit/bf1f9af223968a6156aa43419904b50de2ef250d))

# [1.21.0-alpha.142](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.141...v1.21.0-alpha.142) (2025-04-10)


### Bug Fixes

* **ios:** fabric getMapBoundaries return correct dictionary ([bd095e7](https://github.com/react-native-maps/react-native-maps/commit/bd095e761a128769e2b71cde49137bb8492f3a9c))

# [1.21.0-alpha.141](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.140...v1.21.0-alpha.141) (2025-04-05)


### Features

* **Overlay:** fabric support ([f2b3bc6](https://github.com/react-native-maps/react-native-maps/commit/f2b3bc612e658fb2a68504497a4faace9e977c4e))

# [1.21.0-alpha.140](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.139...v1.21.0-alpha.140) (2025-04-05)


### Features

* **android:** fabric support ([9cf48c5](https://github.com/react-native-maps/react-native-maps/commit/9cf48c59dea2625b4453cdab04a2641d177aadfe))

# [1.21.0-alpha.139](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.138...v1.21.0-alpha.139) (2025-04-05)


### Features

* **android:** fabric support ([43fddda](https://github.com/react-native-maps/react-native-maps/commit/43fddda4c64e383d14fa9c9e8f57d5b000398416))

# [1.21.0-alpha.138](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.137...v1.21.0-alpha.138) (2025-04-04)


### Features

* **android:** fabric support ([29780ef](https://github.com/react-native-maps/react-native-maps/commit/29780efb24dbf72a565ec47e5872284fdd9354ad))

# [1.21.0-alpha.137](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.136...v1.21.0-alpha.137) (2025-04-03)


### Features

* **iOS:** google-maps fabric support ([5eef8a1](https://github.com/react-native-maps/react-native-maps/commit/5eef8a15d7496b94aa81b2a2febd201410e34907))

# [1.21.0-alpha.136](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.135...v1.21.0-alpha.136) (2025-04-03)


### Features

* **android:** fabric support ([8c14fec](https://github.com/react-native-maps/react-native-maps/commit/8c14fec636129cc754799dae1029d1010578b09d))

# [1.21.0-alpha.135](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.134...v1.21.0-alpha.135) (2025-04-03)


### Features

* **iOS:** fabric support ([1e58b92](https://github.com/react-native-maps/react-native-maps/commit/1e58b920f05a573e70508518e37c3b3ab2a7907a))

# [1.21.0-alpha.134](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.133...v1.21.0-alpha.134) (2025-04-03)


### Features

* **google:** add support for mapStyle ([5d0d665](https://github.com/react-native-maps/react-native-maps/commit/5d0d6654d4e08297b4cf28a5fb08142779df8ea2))

# [1.21.0-alpha.133](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.132...v1.21.0-alpha.133) (2025-04-01)


### Bug Fixes

* onMapReady was blocking map rendering ([8cddc33](https://github.com/react-native-maps/react-native-maps/commit/8cddc33573cda1c530c2886642e61b92a8515aad))

# [1.21.0-alpha.132](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.131...v1.21.0-alpha.132) (2025-03-30)


### Features

* **android:** support for Fabric ([eed7806](https://github.com/react-native-maps/react-native-maps/commit/eed7806b7b035ccb7c036fc23d4f91c8b1027730))

# [1.21.0-alpha.131](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.130...v1.21.0-alpha.131) (2025-03-29)


### Features

* **ios:** support for Fabric ([0b80c14](https://github.com/react-native-maps/react-native-maps/commit/0b80c1480c7bfd62b1a2f1dc28e330d2e37d415f))

# [1.21.0-alpha.130](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.129...v1.21.0-alpha.130) (2025-03-29)


### Features

* **ios:** support for Fabric ([e7217b0](https://github.com/react-native-maps/react-native-maps/commit/e7217b0ffbe9d3a2b09b8299d01d8acd80266e3d))

# [1.21.0-alpha.129](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.128...v1.21.0-alpha.129) (2025-03-29)


### Features

* **ios:** support for Fabric ([2e522e5](https://github.com/react-native-maps/react-native-maps/commit/2e522e5eb3aa6d013f425c2ca40b5ec55fcbba7c))

# [1.21.0-alpha.128](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.127...v1.21.0-alpha.128) (2025-03-29)


### Features

* **ios:** support for Fabric ([c6cf905](https://github.com/react-native-maps/react-native-maps/commit/c6cf905c4a7ff477bb88f6fe12e2dc380e2d1767))

# [1.21.0-alpha.127](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.126...v1.21.0-alpha.127) (2025-03-29)


### Features

* **ios:** support for Fabric ([45b93d6](https://github.com/react-native-maps/react-native-maps/commit/45b93d6f27140b1c86599c8633650fd616cdff5b))

# [1.21.0-alpha.126](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.125...v1.21.0-alpha.126) (2025-03-28)


### Features

* **android:** support for Fabric ([e87884e](https://github.com/react-native-maps/react-native-maps/commit/e87884e5345f7019fa194dd6dfe4a94292e3867f))

# [1.21.0-alpha.125](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.124...v1.21.0-alpha.125) (2025-03-28)


### Features

* **android:** support for Fabric ([af79408](https://github.com/react-native-maps/react-native-maps/commit/af794080f3dd7485a87dd07358665fc0ec436b37))

# [1.21.0-alpha.124](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.123...v1.21.0-alpha.124) (2025-03-28)


### Features

* **android:** support for Fabric ([9a54254](https://github.com/react-native-maps/react-native-maps/commit/9a542549d0a188d138ebee17e5617abd9d2bf8c4))

# [1.21.0-alpha.123](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.122...v1.21.0-alpha.123) (2025-03-28)


### Features

* **android:** support for Fabric ([9644dd5](https://github.com/react-native-maps/react-native-maps/commit/9644dd5d0f77d30f85bc4f6cb27febcd277a1e15))

# [1.21.0-alpha.122](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.121...v1.21.0-alpha.122) (2025-03-28)


### Features

* **iOS:** support for Fabric ([4421524](https://github.com/react-native-maps/react-native-maps/commit/44215244c75ae2ad48dcda1aea386d3566e6926b))

# [1.21.0-alpha.121](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.120...v1.21.0-alpha.121) (2025-03-28)


### Features

* **iOS:** support for Fabric ([87fd3ec](https://github.com/react-native-maps/react-native-maps/commit/87fd3ec47e7d3a1331ee20affcba9d7d94572160))

# [1.21.0-alpha.120](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.119...v1.21.0-alpha.120) (2025-03-28)


### Features

* **iOS:** support for Fabric ([83badeb](https://github.com/react-native-maps/react-native-maps/commit/83badebe8aa4a36e0cb2d2d9e04b370fa273499f))

# [1.21.0-alpha.119](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.118...v1.21.0-alpha.119) (2025-03-28)


### Features

* **iOS:** support for Fabric ([b091399](https://github.com/react-native-maps/react-native-maps/commit/b091399551cc8a14067afc0b630c00531674f4b7))


### Reverts

* Revert "feat(iOS): support for Fabric" ([1e862c2](https://github.com/react-native-maps/react-native-maps/commit/1e862c2561a85e6e3c8dce2ac95461ce3635b3ac))

# [1.21.0-alpha.118](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.117...v1.21.0-alpha.118) (2025-03-28)


### Features

* **iOS:** support for Fabric ([b64a74d](https://github.com/react-native-maps/react-native-maps/commit/b64a74dce789b8f1e1fae9dac78d5d83f15525f0))

# [1.21.0-alpha.117](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.116...v1.21.0-alpha.117) (2025-03-28)


### Features

* **iOS:** support for Fabric ([3dc2887](https://github.com/react-native-maps/react-native-maps/commit/3dc2887bb6c343c819dc61533fc3d5bb61d2e523))

# [1.21.0-alpha.116](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.115...v1.21.0-alpha.116) (2025-03-28)


### Features

* **iOS:** support for Fabric ([852a55c](https://github.com/react-native-maps/react-native-maps/commit/852a55c3147252dc93ff7f83fd172bf18cb61d8c))

# [1.21.0-alpha.115](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.114...v1.21.0-alpha.115) (2025-03-23)


### Features

* **iOS:** support for Fabric ([9ee2dd7](https://github.com/react-native-maps/react-native-maps/commit/9ee2dd7ff6a9ccc91df766a64019e3292eab6f2a))

# [1.21.0-alpha.114](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.113...v1.21.0-alpha.114) (2025-03-23)


### Features

* **iOS:** support for Fabric ([91dbc57](https://github.com/react-native-maps/react-native-maps/commit/91dbc5780e173f18c3ba3cbd092975e5792dfa53))

# [1.21.0-alpha.113](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.112...v1.21.0-alpha.113) (2025-03-23)


### Features

* **iOS:** support for Fabric ([4ed1548](https://github.com/react-native-maps/react-native-maps/commit/4ed1548d0eae495b2f7494b0b980fcf8223fe985))

# [1.21.0-alpha.112](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.111...v1.21.0-alpha.112) (2025-03-21)


### Features

* **iOS:** support for Fabric ([61a4371](https://github.com/react-native-maps/react-native-maps/commit/61a4371dcd5e0e128f35cb055e99d8b09c27bb06))

# [1.21.0-alpha.111](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.110...v1.21.0-alpha.111) (2025-03-21)


### Features

* **iOS:** support for Fabric ([cad6eb1](https://github.com/react-native-maps/react-native-maps/commit/cad6eb1709b59710e017bd4409f6f3004d98840b))

# [1.21.0-alpha.110](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.109...v1.21.0-alpha.110) (2025-03-16)


### Features

* **android:** support for Fabric ([7033a2b](https://github.com/react-native-maps/react-native-maps/commit/7033a2bd1390dbf5402e6f0ef00caf5b8a88048a))

# [1.21.0-alpha.109](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.108...v1.21.0-alpha.109) (2025-03-16)


### Features

* **android-ios:** support for Fabric ([0c9cb51](https://github.com/react-native-maps/react-native-maps/commit/0c9cb517df924d1b2e14d27f9abe16f13c35f6ee))

# [1.21.0-alpha.108](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.107...v1.21.0-alpha.108) (2025-03-16)


### Features

* **android-ios:** support for Fabric ([8ca7f9d](https://github.com/react-native-maps/react-native-maps/commit/8ca7f9d71798d5697c2c270f16aa9030ca79f35f))

# [1.21.0-alpha.107](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.106...v1.21.0-alpha.107) (2025-03-16)


### Features

* **android-ios:** support for Fabric ([a4c3ca6](https://github.com/react-native-maps/react-native-maps/commit/a4c3ca6f4463ac62c40bd31510ba8775bd527674))

# [1.21.0-alpha.106](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.105...v1.21.0-alpha.106) (2025-03-16)


### Features

* **android-ios:** support for Fabric ([8064d15](https://github.com/react-native-maps/react-native-maps/commit/8064d15d2fadcc8afb8bbb5e914851a1162eb05b))

# [1.21.0-alpha.105](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.104...v1.21.0-alpha.105) (2025-03-16)


### Features

* **android-ios:** support for Fabric ([1a8a799](https://github.com/react-native-maps/react-native-maps/commit/1a8a799727b392922488a26c96a8c583b3c049f9))

# [1.21.0-alpha.104](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.103...v1.21.0-alpha.104) (2025-03-14)


### Features

* **ios:** support for Fabric ([8785b5d](https://github.com/react-native-maps/react-native-maps/commit/8785b5d1145a6d506c997e9efea8a1432ca422d6))

# [1.21.0-alpha.103](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.102...v1.21.0-alpha.103) (2025-03-14)


### Features

* **ios:** support for Fabric ([90eb07a](https://github.com/react-native-maps/react-native-maps/commit/90eb07aba0c5a74312a35af6f1e166878d7544ad))

# [1.21.0-alpha.102](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.101...v1.21.0-alpha.102) (2025-03-13)


### Features

* **ios:** support for Fabric ([8511bf5](https://github.com/react-native-maps/react-native-maps/commit/8511bf5d7b0dce9ee4ad21d3056f74d767a1a5aa))

# [1.21.0-alpha.101](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.100...v1.21.0-alpha.101) (2025-03-11)


### Features

* **android:** support for Fabric ([aa53907](https://github.com/react-native-maps/react-native-maps/commit/aa53907b8ea30c99b411b17b5e5d89e36039d5bf))

# [1.21.0-alpha.100](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.99...v1.21.0-alpha.100) (2025-03-11)


### Features

* **android:** support for Fabric ([1015f3d](https://github.com/react-native-maps/react-native-maps/commit/1015f3d6366860594634e1d58d4a048ed2257b13))

# [1.21.0-alpha.99](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.98...v1.21.0-alpha.99) (2025-03-10)


### Features

* **ios:** support for Fabric ([b664cf1](https://github.com/react-native-maps/react-native-maps/commit/b664cf1d87f9ec981d4919b19e8c7a216d2558f9))

# [1.21.0-alpha.98](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.97...v1.21.0-alpha.98) (2025-03-10)


### Features

* **ios:** support for Fabric ([0a780e2](https://github.com/react-native-maps/react-native-maps/commit/0a780e208b9fc43c39c24d5b8e9fe2941f213833))
* **ios:** support for Fabric ([2466197](https://github.com/react-native-maps/react-native-maps/commit/2466197ebbcf741016cd1acd5dc09a4b906cbb72))


### Reverts

* Revert "feat(ios): support for Fabric" ([3e16ef6](https://github.com/react-native-maps/react-native-maps/commit/3e16ef677d1634ee7a7f004b813a3c345b9240d1))

# [1.21.0-alpha.97](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.96...v1.21.0-alpha.97) (2025-03-09)


### Features

* **ios:** support for Fabric ([75ad1b4](https://github.com/react-native-maps/react-native-maps/commit/75ad1b44bb89453203697719bef79dbdd5b16da0))

# [1.21.0-alpha.96](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.95...v1.21.0-alpha.96) (2025-03-09)


### Features

* **ios:** support for Fabric ([f200c23](https://github.com/react-native-maps/react-native-maps/commit/f200c2322de6cc9001875b25dffbb5014a9faf7b))

# [1.21.0-alpha.95](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.94...v1.21.0-alpha.95) (2025-03-03)


### Features

* **ios:** support for Fabric ([19e03e3](https://github.com/react-native-maps/react-native-maps/commit/19e03e3b91d78c5ae2474860f5048d0b51ac445f))

# [1.21.0-alpha.94](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.93...v1.21.0-alpha.94) (2025-03-03)


### Features

* **ios:** support for Fabric ([0324c3a](https://github.com/react-native-maps/react-native-maps/commit/0324c3a863825e2cc9c976f91b310a6727720c9b))

# [1.21.0-alpha.93](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.92...v1.21.0-alpha.93) (2025-03-03)


### Features

* **ios:** support for Fabric ([634405c](https://github.com/react-native-maps/react-native-maps/commit/634405cdb12b726c8b959667efea0b80dc81ee6f))

# [1.21.0-alpha.92](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.91...v1.21.0-alpha.92) (2025-03-03)


### Features

* **ios:** support for Fabric ([eb8a1e7](https://github.com/react-native-maps/react-native-maps/commit/eb8a1e7ad24fac33409160141d0a6859cd4aa49b))

# [1.21.0-alpha.91](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.90...v1.21.0-alpha.91) (2025-03-03)


### Features

* **ios:** support for Fabric ([5ca2cdc](https://github.com/react-native-maps/react-native-maps/commit/5ca2cdcce50dcabd681075bb6750fedcfa268f1c))

# [1.21.0-alpha.90](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.89...v1.21.0-alpha.90) (2025-03-02)


### Features

* **Fabric:** support for Fabric ([#5374](https://github.com/react-native-maps/react-native-maps/issues/5374)) ([5d299e8](https://github.com/react-native-maps/react-native-maps/commit/5d299e82db3a51391f5b50499874bbc2b2736588))

# [1.21.0-alpha.89](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.88...v1.21.0-alpha.89) (2025-03-02)


### Features

* **android:** support for Fabric ([4af5401](https://github.com/react-native-maps/react-native-maps/commit/4af540186c1907b066698f83858d097e969c8ac1))

# [1.21.0-alpha.88](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.87...v1.21.0-alpha.88) (2025-03-02)


### Features

* **android:** support for Fabric ([217b904](https://github.com/react-native-maps/react-native-maps/commit/217b904e7bc3da300b8682ff23577850425b6450))

# [1.21.0-alpha.87](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.86...v1.21.0-alpha.87) (2025-03-02)


### Features

* **ios/android:** support for Fabric ([88982cb](https://github.com/react-native-maps/react-native-maps/commit/88982cb7d2d884b740c00fe9cf49454afd63a99b))

# [1.21.0-alpha.86](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.85...v1.21.0-alpha.86) (2025-03-02)


### Features

* **android:** support for Fabric ([12f64a0](https://github.com/react-native-maps/react-native-maps/commit/12f64a07cb1d7a0f7900bc337d8a7e97b648e31b))

# [1.21.0-alpha.85](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.84...v1.21.0-alpha.85) (2025-03-02)


### Features

* **android:** support for Fabric ([738cf9f](https://github.com/react-native-maps/react-native-maps/commit/738cf9f9fdd86f5ae69a011ce82d937aa38e5aa7))

# [1.21.0-alpha.84](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.83...v1.21.0-alpha.84) (2025-03-02)


### Features

* **android:** support for Fabric ([238545f](https://github.com/react-native-maps/react-native-maps/commit/238545f6dfcabfad2c9b529bce7a7d24bb12b1a8))

# [1.21.0-alpha.83](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.82...v1.21.0-alpha.83) (2025-03-01)


### Features

* **android:** support for Fabric ([e78f26e](https://github.com/react-native-maps/react-native-maps/commit/e78f26e06260e5abdbaba9d3c5e1fcaa4c9877ad))

# [1.21.0-alpha.82](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.81...v1.21.0-alpha.82) (2025-03-01)


### Features

* **android:** support for Fabric ([164311f](https://github.com/react-native-maps/react-native-maps/commit/164311fb8d8628c02c673a79e74cbb73ce12684d))

# [1.21.0-alpha.81](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.80...v1.21.0-alpha.81) (2025-03-01)


### Features

* **android:** support for Fabric ([c2d8867](https://github.com/react-native-maps/react-native-maps/commit/c2d886716f33b9e14204675d59197bb0d3d4ef33))

# [1.21.0-alpha.80](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.79...v1.21.0-alpha.80) (2025-03-01)


### Features

* **android:** support for Fabric ([cf95a44](https://github.com/react-native-maps/react-native-maps/commit/cf95a44b01d8897a3bd7db4851270ca95aab9307))

# [1.21.0-alpha.79](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.78...v1.21.0-alpha.79) (2025-02-28)


### Features

* **android:** support for Fabric ([2c52024](https://github.com/react-native-maps/react-native-maps/commit/2c5202454307abdd2bc2e29bb78a24125cedc6b3))

# [1.21.0-alpha.78](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.77...v1.21.0-alpha.78) (2025-02-25)


### Features

* **android:** support for Fabric ([507a8cb](https://github.com/react-native-maps/react-native-maps/commit/507a8cb61f225501feee7833974fc4da927f25ef))

# [1.21.0-alpha.77](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.76...v1.21.0-alpha.77) (2025-02-25)


### Features

* **ios:** support for Fabric ([f4483fb](https://github.com/react-native-maps/react-native-maps/commit/f4483fb67c157fb356403817e62fa63134a547f0))

# [1.21.0-alpha.76](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.75...v1.21.0-alpha.76) (2025-02-25)


### Features

* **ios:** support for Fabric ([9979af0](https://github.com/react-native-maps/react-native-maps/commit/9979af0e1ad96ed1da9348751fd281fbda5e4bf2))

# [1.21.0-alpha.75](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.74...v1.21.0-alpha.75) (2025-02-24)


### Features

* **android:** support for Fabric ([7984e62](https://github.com/react-native-maps/react-native-maps/commit/7984e627dd54169b65b2ce2d7a2b522c8429f34e))

# [1.21.0-alpha.74](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.73...v1.21.0-alpha.74) (2025-02-24)


### Features

* **android:** support for Fabric ([171f1f1](https://github.com/react-native-maps/react-native-maps/commit/171f1f10509f241d0d7191d1760974c162314c44))

# [1.21.0-alpha.73](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.72...v1.21.0-alpha.73) (2025-02-23)


### Features

* **android:** support for Fabric ([d2c77b6](https://github.com/react-native-maps/react-native-maps/commit/d2c77b60504f053cc3c1ea0ddf7196133810705c))

# [1.21.0-alpha.72](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.71...v1.21.0-alpha.72) (2025-02-23)


### Features

* **android:** support for Fabric ([af0998f](https://github.com/react-native-maps/react-native-maps/commit/af0998fd8f3daea2a42ed38d596918829be7a962))

# [1.21.0-alpha.71](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.70...v1.21.0-alpha.71) (2025-02-23)


### Features

* **android:** support for Fabric ([462995c](https://github.com/react-native-maps/react-native-maps/commit/462995cfe1903f020ccd913d2658729168abdb6b))
* **android:** support for Fabric ([7b9ebed](https://github.com/react-native-maps/react-native-maps/commit/7b9ebed89ce9bc4d8b8dadae9e1c840e3b7e81ff))

# [1.21.0-alpha.70](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.69...v1.21.0-alpha.70) (2025-02-23)


### Features

* **android:** support for Fabric ([14fdcc4](https://github.com/react-native-maps/react-native-maps/commit/14fdcc445bb3b44324d44024aaadad83f9b972a1))

# [1.21.0-alpha.69](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.68...v1.21.0-alpha.69) (2025-02-23)


### Features

* **android:** support for Fabric ([b52e5da](https://github.com/react-native-maps/react-native-maps/commit/b52e5da54fbd9b121c8bb2fb07f6bb752f0bbc41))

# [1.21.0-alpha.68](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.67...v1.21.0-alpha.68) (2025-02-23)


### Features

* **android:** support for Fabric ([b9d3bb6](https://github.com/react-native-maps/react-native-maps/commit/b9d3bb6bd4d5381cf73bda53c1a20c9b78769b8a))

# [1.21.0-alpha.67](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.66...v1.21.0-alpha.67) (2025-02-23)


### Features

* **android:** support for Fabric ([c98a1f9](https://github.com/react-native-maps/react-native-maps/commit/c98a1f92097c654567a626c96f0861a0d96b9088))

# [1.21.0-alpha.66](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.65...v1.21.0-alpha.66) (2025-02-22)


### Features

* **android:** support for Fabric ([e445b01](https://github.com/react-native-maps/react-native-maps/commit/e445b01104a571590309ff88c731d8ad2a89ca4f))

# [1.21.0-alpha.65](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.64...v1.21.0-alpha.65) (2025-02-22)


### Features

* **android:** support for Fabric ([af95dd2](https://github.com/react-native-maps/react-native-maps/commit/af95dd2d68a0d3751c2693b9b39c831f6c795b6b))

# [1.21.0-alpha.64](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.63...v1.21.0-alpha.64) (2025-02-22)


### Bug Fixes

* **ios:** removed unsupported fill color props ([#5360](https://github.com/react-native-maps/react-native-maps/issues/5360)) ([ed71d3c](https://github.com/react-native-maps/react-native-maps/commit/ed71d3c8aef209edfcf6383e584bb8076a8f0495))

# [1.21.0-alpha.63](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.62...v1.21.0-alpha.63) (2025-02-22)


### Features

* **ios:** support for Fabric ([0f5dd8b](https://github.com/react-native-maps/react-native-maps/commit/0f5dd8b8adf46fb936c072ddfa2e3bfbaf517a12))

# [1.21.0-alpha.62](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.61...v1.21.0-alpha.62) (2025-02-16)


### Features

* **android:** support for Fabric ([a2ec407](https://github.com/react-native-maps/react-native-maps/commit/a2ec407f195351f521a428b5b83926458d970594))

# [1.21.0-alpha.61](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.60...v1.21.0-alpha.61) (2025-02-15)


### Features

* **android:** support for Fabric ([e3b0c68](https://github.com/react-native-maps/react-native-maps/commit/e3b0c681de36d48b8621944c3d2b2d625c43b6b0))

# [1.21.0-alpha.60](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.59...v1.21.0-alpha.60) (2025-02-08)


### Features

* **android:** support for Fabric ([e4cbb06](https://github.com/react-native-maps/react-native-maps/commit/e4cbb06f575a1910e2eae72a624514167d48f6b9))

# [1.21.0-alpha.59](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.58...v1.21.0-alpha.59) (2025-02-08)


### Features

* **android:** support for Fabric ([61bdcad](https://github.com/react-native-maps/react-native-maps/commit/61bdcad8f552bb6fe153b7c972510635f177180c))

# [1.21.0-alpha.58](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.57...v1.21.0-alpha.58) (2025-02-08)


### Features

* **android:** support for Fabric ([4c6d053](https://github.com/react-native-maps/react-native-maps/commit/4c6d053151f2066a488da3e1fc7a3ab6f124f3e2))

# [1.21.0-alpha.57](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.56...v1.21.0-alpha.57) (2025-02-08)


### Features

* **android:** support for Fabric ([32ed252](https://github.com/react-native-maps/react-native-maps/commit/32ed252ebcb2e9bdedc05d95e88a5768b9a25761))

# [1.21.0-alpha.56](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.55...v1.21.0-alpha.56) (2025-02-08)


### Features

* **android:** support for Fabric ([2be4b89](https://github.com/react-native-maps/react-native-maps/commit/2be4b89feac85922d382bef56cf82b1353fa609d))

# [1.21.0-alpha.55](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.54...v1.21.0-alpha.55) (2025-02-07)


### Features

* **android:** support for Fabric ([e6ab6b3](https://github.com/react-native-maps/react-native-maps/commit/e6ab6b3b6ef2949787725c76703d5f1dc4e8b63f))

# [1.21.0-alpha.54](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.53...v1.21.0-alpha.54) (2025-02-02)


### Features

* **android:** support for Fabric ([ede5a57](https://github.com/react-native-maps/react-native-maps/commit/ede5a57279b3cfa9d0cb2a7961337c4101b127c7))

# [1.21.0-alpha.53](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.52...v1.21.0-alpha.53) (2025-02-02)


### Features

* **android:** support for Fabric ([d9f9513](https://github.com/react-native-maps/react-native-maps/commit/d9f951302b0c90f3021beed525b1d0a0ae30b477))

# [1.21.0-alpha.52](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.51...v1.21.0-alpha.52) (2025-02-02)


### Features

* **android:** support for Fabric ([8cab275](https://github.com/react-native-maps/react-native-maps/commit/8cab27558a836588d15e6bb21bc3d632aa5ffec1))

# [1.21.0-alpha.51](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.50...v1.21.0-alpha.51) (2025-02-01)


### Features

* **android:** support for Fabric ([ebbd611](https://github.com/react-native-maps/react-native-maps/commit/ebbd611e5e06dd6d0b0db478abc71d1f7d1537db))

# [1.21.0-alpha.50](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.49...v1.21.0-alpha.50) (2025-02-01)


### Features

* **ios/android:** support for Fabric ([0ac6ec1](https://github.com/react-native-maps/react-native-maps/commit/0ac6ec114d0ff769cfa0dbdc8e217df3127ec1f1))

# [1.21.0-alpha.49](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.48...v1.21.0-alpha.49) (2025-01-18)


### Features

* **ios:** support for Fabric ([65dae80](https://github.com/react-native-maps/react-native-maps/commit/65dae805ed68d7a28c06095572eca881d6cbd8a1))

# [1.21.0-alpha.48](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.47...v1.21.0-alpha.48) (2025-01-18)


### Features

* **ios:** support for Fabric ([e9bc3ef](https://github.com/react-native-maps/react-native-maps/commit/e9bc3ef4fcc23645b26bce574c595d6ce8037605))

# [1.21.0-alpha.47](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.46...v1.21.0-alpha.47) (2025-01-18)


### Features

* **ios:** support for Fabric for GoogleMaps ([8607e0d](https://github.com/react-native-maps/react-native-maps/commit/8607e0dc3b3790ab02d68eaf1202d6997044af73))

# [1.21.0-alpha.46](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.45...v1.21.0-alpha.46) (2025-01-18)


### Features

* **ios:** support for Fabric for AppleMaps ([20a7f65](https://github.com/react-native-maps/react-native-maps/commit/20a7f65de240e84a9c6be6ba0881c3c7c23e5185))

# [1.21.0-alpha.45](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.44...v1.21.0-alpha.45) (2025-01-18)


### Features

* **ios:** support for Fabric for AppleMaps ([ccbee6f](https://github.com/react-native-maps/react-native-maps/commit/ccbee6f9aaca0a15a6b539d9ea354f29bd409018))

# [1.21.0-alpha.44](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.43...v1.21.0-alpha.44) (2025-01-17)


### Features

* **ios:** support for Fabric for AppleMaps ([081cb8f](https://github.com/react-native-maps/react-native-maps/commit/081cb8f6e4daa802996e11b0bfa5ab789d093bb3))

# [1.21.0-alpha.43](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.42...v1.21.0-alpha.43) (2025-01-17)


### Features

* **ios:** support for Fabric for GoogleMaps ([2d8efc0](https://github.com/react-native-maps/react-native-maps/commit/2d8efc0f98a048058ea5396bf492e94a4001bde6))

# [1.21.0-alpha.42](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.41...v1.21.0-alpha.42) (2025-01-17)


### Features

* **ios:** support for Fabric for AppleMaps ([2b08966](https://github.com/react-native-maps/react-native-maps/commit/2b089668887bc6aea603317e7373e011a9cd2ea9))

# [1.21.0-alpha.41](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.40...v1.21.0-alpha.41) (2025-01-17)


### Features

* **ios:** support for Fabric for GoogleMaps ([76cb011](https://github.com/react-native-maps/react-native-maps/commit/76cb01195a1c767d4c7aed2e04a49784f7bf7c49))

# [1.21.0-alpha.40](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.39...v1.21.0-alpha.40) (2025-01-17)


### Features

* **ios:** support for Fabric for GoogleMaps ([9bb27e3](https://github.com/react-native-maps/react-native-maps/commit/9bb27e3571dcac9001dc77ff927c4ec4364467a9))

# [1.21.0-alpha.39](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.38...v1.21.0-alpha.39) (2025-01-17)


### Features

* **ios:** support for Fabric for Apple Maps ([c6bbb0b](https://github.com/react-native-maps/react-native-maps/commit/c6bbb0bf9c57a74e4509a5ea87a69f1e2da504f2))

# [1.21.0-alpha.38](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.37...v1.21.0-alpha.38) (2025-01-12)


### Features

* **ios:** support for Fabric for GoogleMaps ([e8db89d](https://github.com/react-native-maps/react-native-maps/commit/e8db89d0fb73983fbb4e8a9f9f566e8bdf39b5e5))

# [1.21.0-alpha.37](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.36...v1.21.0-alpha.37) (2025-01-12)


### Features

* **ios:** support for Fabric for GoogleMaps ([484fbcf](https://github.com/react-native-maps/react-native-maps/commit/484fbcf4a876653fa30de6e12901bd35991a5bad))

# [1.21.0-alpha.36](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.35...v1.21.0-alpha.36) (2025-01-12)


### Features

* **ios:** support for Fabric for GoogleMaps ([85df2c0](https://github.com/react-native-maps/react-native-maps/commit/85df2c0ec9ed1daae1d50915a67fe302c518f039))

# [1.21.0-alpha.35](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.34...v1.21.0-alpha.35) (2025-01-12)


### Features

* **ios:** support for Fabric for Apple Maps ([179b195](https://github.com/react-native-maps/react-native-maps/commit/179b19526461003540d7cbfda620a33ae809e255))

# [1.21.0-alpha.34](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.33...v1.21.0-alpha.34) (2025-01-12)


### Features

* **ios:** support for Fabric for Apple Maps ([0539c9a](https://github.com/react-native-maps/react-native-maps/commit/0539c9a6b329bc81f104f665b2a585e77847bbc6))

# [1.21.0-alpha.33](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.32...v1.21.0-alpha.33) (2025-01-11)


### Features

* **ios:** support for Fabric for Apple Maps ([7127207](https://github.com/react-native-maps/react-native-maps/commit/7127207144fe3523bf240bac301b7ef7a95e7b62))

# [1.21.0-alpha.32](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.31...v1.21.0-alpha.32) (2025-01-11)


### Features

* **ios:** support for Fabric for Apple Maps ([834299b](https://github.com/react-native-maps/react-native-maps/commit/834299b93dc0a588fa2a813d87bbd6d86cda084d))

# [1.21.0-alpha.31](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.30...v1.21.0-alpha.31) (2025-01-11)


### Features

* **ios:** support for Fabric for Apple Maps ([db9c2dd](https://github.com/react-native-maps/react-native-maps/commit/db9c2dd1fabc09d2bd5dd84ea415a20af58164cb))

# [1.21.0-alpha.30](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.29...v1.21.0-alpha.30) (2025-01-11)


### Features

* **ios:** support for Fabric for Apple Maps ([d001603](https://github.com/react-native-maps/react-native-maps/commit/d0016035e078f13d07edaa29e497eb8a5e0603fc))

# [1.21.0-alpha.29](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.28...v1.21.0-alpha.29) (2025-01-11)


### Features

* **ios:** support for Fabric for Apple Maps ([eb3980c](https://github.com/react-native-maps/react-native-maps/commit/eb3980c3ad6588ee5a9afc988caf60b77029a255))

# [1.21.0-alpha.28](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.27...v1.21.0-alpha.28) (2025-01-10)


### Features

* **ios:** support for Fabric for Google Maps ([11077a7](https://github.com/react-native-maps/react-native-maps/commit/11077a7e1c648663b5441f1a18e9cee97c0fa593))

# [1.21.0-alpha.27](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.26...v1.21.0-alpha.27) (2025-01-10)


### Features

* **ios:** support for Fabric for Apple Maps ([b2cb741](https://github.com/react-native-maps/react-native-maps/commit/b2cb7418a1a64207aa38a167a2ed5e3ce0f39a9a))

# [1.21.0-alpha.26](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.25...v1.21.0-alpha.26) (2025-01-10)


### Features

* **ios:** support for Fabric for Apple Maps ([0c7dc73](https://github.com/react-native-maps/react-native-maps/commit/0c7dc732539fa3815dd9887c89273865cd836cb5))

# [1.21.0-alpha.25](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.24...v1.21.0-alpha.25) (2025-01-10)


### Features

* **ios:** support for Fabric for Apple Maps ([297c8ca](https://github.com/react-native-maps/react-native-maps/commit/297c8ca838e2d7bf6604e3f742b0c1fc68981e8c))

# [1.21.0-alpha.24](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.23...v1.21.0-alpha.24) (2025-01-10)


### Features

* **ios:** support for Fabric for Apple Maps ([3843634](https://github.com/react-native-maps/react-native-maps/commit/384363470ab1542405e042cb2194595b044e8057))

# [1.21.0-alpha.23](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.22...v1.21.0-alpha.23) (2025-01-10)


### Features

* **ios:** support for Fabric for Apple Maps ([2cc1336](https://github.com/react-native-maps/react-native-maps/commit/2cc1336afbacc9b0dce44c1278cfeac99b03e1a5)), closes [fix#2](https://github.com/fix/issues/2)

# [1.21.0-alpha.22](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.21...v1.21.0-alpha.22) (2025-01-05)


### Features

* **ios:** support for Fabric for Apple Maps ([2bb6931](https://github.com/react-native-maps/react-native-maps/commit/2bb6931044ef81074b259edbd1615b9b525a1d19))

# [1.21.0-alpha.21](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.20...v1.21.0-alpha.21) (2025-01-05)


### Features

* **ios:** support for Fabric for Apple Maps ([78abd6e](https://github.com/react-native-maps/react-native-maps/commit/78abd6ea9ed3dfea628a3709dbf3ed02760bfcc3))

# [1.21.0-alpha.20](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.19...v1.21.0-alpha.20) (2025-01-04)


### Features

* **ios:** support for Fabric for Apple Maps ([0bfdcf4](https://github.com/react-native-maps/react-native-maps/commit/0bfdcf4ae16f263a40ab38c273648ebf8352ff56))

# [1.21.0-alpha.19](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.18...v1.21.0-alpha.19) (2025-01-04)


### Features

* **ios:** support for Fabric for Apple Maps ([5de1bc3](https://github.com/react-native-maps/react-native-maps/commit/5de1bc341a4c1c85397ec6505031fb7f806b03bc))

# [1.21.0-alpha.18](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.17...v1.21.0-alpha.18) (2025-01-03)


### Features

* **ios:** support for Fabric GoogleMaps ([30e2845](https://github.com/react-native-maps/react-native-maps/commit/30e2845ca676823454a7770f4ad78630d472864f))

# [1.21.0-alpha.17](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.16...v1.21.0-alpha.17) (2025-01-03)


### Features

* **ios:** support for Fabric GoogleMaps ([090e3bb](https://github.com/react-native-maps/react-native-maps/commit/090e3bbbd4469473b51f6e8b52fb70ed962cbaf7))

# [1.21.0-alpha.16](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.15...v1.21.0-alpha.16) (2025-01-03)


### Features

* **ios:** support for Fabric GoogleMaps ([ea53589](https://github.com/react-native-maps/react-native-maps/commit/ea5358975f8e2fd8ecf3f8cc4b59430c0dd18d97))

# [1.21.0-alpha.15](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.14...v1.21.0-alpha.15) (2025-01-02)


### Features

* **ios:** support for Fabric GoogleMaps ([8321c21](https://github.com/react-native-maps/react-native-maps/commit/8321c211589cdfa91ddaf91224032d5b91c97e5d))

# [1.21.0-alpha.14](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.13...v1.21.0-alpha.14) (2025-01-01)


### Features

* **ios:** support for Fabric GoogleMaps ([449ac52](https://github.com/react-native-maps/react-native-maps/commit/449ac528bc8ed5428312921886d73beee4a418f6))

# [1.21.0-alpha.13](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.12...v1.21.0-alpha.13) (2025-01-01)


### Features

* **google-maps:** more features working with Fabric ([b7612fb](https://github.com/react-native-maps/react-native-maps/commit/b7612fb9814bde2dff368d8e95e4ef7cf200958f))

# [1.21.0-alpha.12](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.11...v1.21.0-alpha.12) (2024-12-31)


### Features

* **ios:** support for Fabric GoogleMaps ([edf2855](https://github.com/react-native-maps/react-native-maps/commit/edf28556d65228293daf4530a983a1ee67800f4c))

# [1.21.0-alpha.11](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.10...v1.21.0-alpha.11) (2024-12-29)


### Features

* **ios:** support for Fabric GoogleMaps ([8cf9c62](https://github.com/react-native-maps/react-native-maps/commit/8cf9c62d8708f809116520897581d33646170d04))

# [1.21.0-alpha.10](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.9...v1.21.0-alpha.10) (2024-12-29)


### Features

* **ios:** support for Fabric GoogleMaps ([c9f11fc](https://github.com/react-native-maps/react-native-maps/commit/c9f11fc47d8612280f7c04c55171ee7ec42302f8))

# [1.21.0-alpha.9](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.8...v1.21.0-alpha.9) (2024-12-29)


### Features

* **ios:** support for Fabric GoogleMaps ([1336666](https://github.com/react-native-maps/react-native-maps/commit/1336666d4f3f55c1eb01864a66642708789b423c))

# [1.21.0-alpha.8](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.7...v1.21.0-alpha.8) (2024-12-28)


### Features

* **ios:** support for Fabric GoogleMaps ([02bb75d](https://github.com/react-native-maps/react-native-maps/commit/02bb75d0a32d191334413e85a9126d0d7b874933))

# [1.21.0-alpha.7](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.6...v1.21.0-alpha.7) (2024-12-28)


### Features

* **ios:** support for Fabric GoogleMaps ([9c5d53b](https://github.com/react-native-maps/react-native-maps/commit/9c5d53b8fa75a55a8793d796549d5d35b5365a15))
* **ios:** support for Fabric GoogleMaps ([c9e49ef](https://github.com/react-native-maps/react-native-maps/commit/c9e49ef98ac0991b8b63b599709438617f9d0019))

# [1.21.0-alpha.6](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.5...v1.21.0-alpha.6) (2024-12-26)


### Bug Fixes

* correct path for codegen ([1041ad3](https://github.com/react-native-maps/react-native-maps/commit/1041ad3d5e6491d8530b2323011f54fc37bff8fb))

# [1.21.0-alpha.5](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.4...v1.21.0-alpha.5) (2024-12-25)


### Bug Fixes

* **android:** maps load correctly with codegen on android ([feef13e](https://github.com/react-native-maps/react-native-maps/commit/feef13eb6c80d82b42d6777692f3025852ca96a7))

# [1.21.0-alpha.4](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.3...v1.21.0-alpha.4) (2024-12-25)


### Bug Fixes

* **android:** fix build.gradle ([c1a1cf5](https://github.com/react-native-maps/react-native-maps/commit/c1a1cf5fa99399780e42154e5a5f89e513b2daf0))

# [1.21.0-alpha.3](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.2...v1.21.0-alpha.3) (2024-12-25)


### Bug Fixes

* **android:** android build with Fabric enabled ([#5306](https://github.com/react-native-maps/react-native-maps/issues/5306)) ([f7ed6a0](https://github.com/react-native-maps/react-native-maps/commit/f7ed6a031c2d25e422cbe17279a1c75a5fa07e48))

# [1.21.0-alpha.2](https://github.com/react-native-maps/react-native-maps/compare/v1.21.0-alpha.1...v1.21.0-alpha.2) (2024-12-25)


### Bug Fixes

* **ios:** re-enable google-maps for iOS ([#5305](https://github.com/react-native-maps/react-native-maps/issues/5305)) ([7652cdf](https://github.com/react-native-maps/react-native-maps/commit/7652cdfa2b5cadc795b357d00019be19701b6d44))

# [1.21.0-alpha.1](https://github.com/react-native-maps/react-native-maps/compare/v1.20.1...v1.21.0-alpha.1) (2024-12-21)


### Features

* **Fabric:** testing new commit ([#5298](https://github.com/react-native-maps/react-native-maps/issues/5298)) ([5c94060](https://github.com/react-native-maps/react-native-maps/commit/5c94060b30f27b84b5c10e5ea0e2396e95183814))

## [1.20.1](https://github.com/react-native-maps/react-native-maps/compare/v1.20.0...v1.20.1) (2024-11-22)


### Bug Fixes

* **ios:** color update in AIRGoogleMap ([#5227](https://github.com/react-native-maps/react-native-maps/issues/5227)) ([f445546](https://github.com/react-native-maps/react-native-maps/commit/f44554637a93de5f505bbf199d2a5fee84c76695))

# [1.20.0](https://github.com/react-native-maps/react-native-maps/compare/v1.19.1...v1.20.0) (2024-11-10)


### Features

* **android:** add support for disabling PoIClick ([#5210](https://github.com/react-native-maps/react-native-maps/issues/5210)) ([d92e283](https://github.com/react-native-maps/react-native-maps/commit/d92e28365ac42fda4b298f0a6b352cc297566660))

## [1.19.1](https://github.com/react-native-maps/react-native-maps/compare/v1.19.0...v1.19.1) (2024-11-10)


### Bug Fixes

* Remove unstable_reactLegacyComponentNames ([#5209](https://github.com/react-native-maps/react-native-maps/issues/5209)) ([33112be](https://github.com/react-native-maps/react-native-maps/commit/33112be8bd4d8c817df5875e08131f3286a10477))

# [1.19.0](https://github.com/react-native-maps/react-native-maps/compare/v1.18.4...v1.19.0) (2024-11-09)


### Features

* add onRegionChangeStart event to MapView ([#5144](https://github.com/react-native-maps/react-native-maps/issues/5144)) ([eeb56f9](https://github.com/react-native-maps/react-native-maps/commit/eeb56f9f08c636eea928f383ce63d3ed1521ff8b))

## [1.18.4](https://github.com/react-native-maps/react-native-maps/compare/v1.18.3...v1.18.4) (2024-11-09)


### Bug Fixes

* **Android:** fix multiple padding related issues on Android ([#5150](https://github.com/react-native-maps/react-native-maps/issues/5150), [#5152](https://github.com/react-native-maps/react-native-maps/issues/5152), [#5153](https://github.com/react-native-maps/react-native-maps/issues/5153), [#5154](https://github.com/react-native-maps/react-native-maps/issues/5154)) ([#5151](https://github.com/react-native-maps/react-native-maps/issues/5151)) ([0009170](https://github.com/react-native-maps/react-native-maps/commit/0009170f26735eda47f1d7316a0642de3c9a952c))

## [1.18.3](https://github.com/react-native-maps/react-native-maps/compare/v1.18.2...v1.18.3) (2024-11-09)


### Bug Fixes

* **iOS:** Refactor onPress(Marker) to return nativeEvent.position for consistency with Android ([#5196](https://github.com/react-native-maps/react-native-maps/issues/5196)) ([956783f](https://github.com/react-native-maps/react-native-maps/commit/956783f90df7053536240a2f0bc51fee094a4b1e)), closes [#4996](https://github.com/react-native-maps/react-native-maps/issues/4996)

## [1.18.2](https://github.com/react-native-maps/react-native-maps/compare/v1.18.1...v1.18.2) (2024-10-14)


### Bug Fixes

* correctly check for iOS OS version before using cameraZoomRange ([#5185](https://github.com/react-native-maps/react-native-maps/issues/5185)) ([4efd881](https://github.com/react-native-maps/react-native-maps/commit/4efd881ffb4995f77d7f325455053d30c50cd429))

## [1.18.1](https://github.com/react-native-maps/react-native-maps/compare/v1.18.0...v1.18.1) (2024-10-12)


### Bug Fixes

* documentation on README.md ([#5174](https://github.com/react-native-maps/react-native-maps/issues/5174)) ([b853f3a](https://github.com/react-native-maps/react-native-maps/commit/b853f3ae28e72aa107eb61db79a90adb00f03492))

# [1.18.0](https://github.com/react-native-maps/react-native-maps/compare/v1.17.3...v1.18.0) (2024-08-18)


### Features

* add anchor and centerOffset prop to GeoJson component to be passed to Marker ([#5140](https://github.com/react-native-maps/react-native-maps/issues/5140)) ([266be79](https://github.com/react-native-maps/react-native-maps/commit/266be79e924298633e60aed5c0b86d077fa479cc)), closes [#5139](https://github.com/react-native-maps/react-native-maps/issues/5139)

## [1.17.3](https://github.com/react-native-maps/react-native-maps/compare/v1.17.2...v1.17.3) (2024-07-27)


### Bug Fixes

* **Android:** Added A11y for Map and Marker ([#5091](https://github.com/react-native-maps/react-native-maps/issues/5091)) ([f3f5a4e](https://github.com/react-native-maps/react-native-maps/commit/f3f5a4e45cb4a27624c87999d366710c17d4daee))

## [1.17.2](https://github.com/react-native-maps/react-native-maps/compare/v1.17.1...v1.17.2) (2024-07-27)


### Bug Fixes

* export PolylinePressEvent ([#5125](https://github.com/react-native-maps/react-native-maps/issues/5125)) ([27fec3a](https://github.com/react-native-maps/react-native-maps/commit/27fec3a993af8fc5a21b9a303b34d73bc34f1914))

## [1.17.1](https://github.com/react-native-maps/react-native-maps/compare/v1.17.0...v1.17.1) (2024-07-21)


### Bug Fixes

* **iOS:** ensure onPress(Marker) returns nativeEvent.position [#4996](https://github.com/react-native-maps/react-native-maps/issues/4996) ([#5092](https://github.com/react-native-maps/react-native-maps/issues/5092)) ([b2d2fd8](https://github.com/react-native-maps/react-native-maps/commit/b2d2fd8cddb8808a41ae881f87a7295ac78f5b06))

# [1.17.0](https://github.com/react-native-maps/react-native-maps/compare/v1.16.0...v1.17.0) (2024-07-21)


### Features

* **android:** add dash pattern for Android Polygon ([#5115](https://github.com/react-native-maps/react-native-maps/issues/5115)) ([#5121](https://github.com/react-native-maps/react-native-maps/issues/5121)) ([4001ae8](https://github.com/react-native-maps/react-native-maps/commit/4001ae89dd82e6f0a247d3255f3cdaba253a0fcd))

# [1.16.0](https://github.com/react-native-maps/react-native-maps/compare/v1.15.7...v1.16.0) (2024-07-20)


### Features

* **ios:** allow use of light compass theme with satellite/hybrid map… ([#5099](https://github.com/react-native-maps/react-native-maps/issues/5099)) ([befb86e](https://github.com/react-native-maps/react-native-maps/commit/befb86e0aa4e8f517301d01bc084246e21c08c0b))

## [1.15.7](https://github.com/react-native-maps/react-native-maps/compare/v1.15.6...v1.15.7) (2024-07-20)


### Bug Fixes

* **ios:** Implement dash options for geojson polygon ([#5115](https://github.com/react-native-maps/react-native-maps/issues/5115)) ([5dc9381](https://github.com/react-native-maps/react-native-maps/commit/5dc9381ae600e239b5aa8a818f94a88dc161d8fb))

## [1.15.6](https://github.com/react-native-maps/react-native-maps/compare/v1.15.5...v1.15.6) (2024-05-30)


### Bug Fixes

* **iOS:** iOS PrivacyInfo fix ([#5078](https://github.com/react-native-maps/react-native-maps/issues/5078)) ([9f458d9](https://github.com/react-native-maps/react-native-maps/commit/9f458d956ba2c16ee3f2a9e8849d9330dcefdda2))

## [1.15.5](https://github.com/react-native-maps/react-native-maps/compare/v1.15.4...v1.15.5) (2024-05-30)


### Bug Fixes

* **android:** UIManagerModule fix for Bridgeless 0.74 ([#5061](https://github.com/react-native-maps/react-native-maps/issues/5061)) ([f194f99](https://github.com/react-native-maps/react-native-maps/commit/f194f9977ea7c6ab547b53e15b4d9a3480c8baa7))

## [1.15.4](https://github.com/react-native-maps/react-native-maps/compare/v1.15.3...v1.15.4) (2024-05-25)


### Bug Fixes

* **ios:** resolve issue with Pods installation ([#5065](https://github.com/react-native-maps/react-native-maps/issues/5065)) ([9992c36](https://github.com/react-native-maps/react-native-maps/commit/9992c36054b0a8a056f0ce97d4687fcdf18c2ca5))

## [1.15.3](https://github.com/react-native-maps/react-native-maps/compare/v1.15.2...v1.15.3) (2024-05-24)


### Bug Fixes

* **android:** move package namespace from Manifest to gradle ([d4916bb](https://github.com/react-native-maps/react-native-maps/commit/d4916bb6fff96f811d40c4d3b3bff8840442929d))

## [1.15.2](https://github.com/react-native-maps/react-native-maps/compare/v1.15.1...v1.15.2) (2024-05-20)


### Bug Fixes

* use initialProps to set zoomTapEnabled in google-maps-ios ([#5059](https://github.com/react-native-maps/react-native-maps/issues/5059)) ([524194f](https://github.com/react-native-maps/react-native-maps/commit/524194ff62859cd82d78cbcca53c6f8e2da29bb7))

## [1.15.1](https://github.com/react-native-maps/react-native-maps/compare/v1.15.0...v1.15.1) (2024-05-05)


### Bug Fixes

* **android:** fix non working tile update ([#5041](https://github.com/react-native-maps/react-native-maps/issues/5041)) ([29107d5](https://github.com/react-native-maps/react-native-maps/commit/29107d516ac6f6cb0ecbd604a5ebe43dfae339a2))

# [1.15.0](https://github.com/react-native-maps/react-native-maps/compare/v1.14.0...v1.15.0) (2024-05-04)


### Features

* **ios:** Add possibility to use both MKMarkerAnnotationView and MKPinAnnotationView ([#5005](https://github.com/react-native-maps/react-native-maps/issues/5005)) ([6e4f49e](https://github.com/react-native-maps/react-native-maps/commit/6e4f49ead61557ca0eed6fd764317a848981e353))

# [1.14.0](https://github.com/react-native-maps/react-native-maps/compare/v1.13.2...v1.14.0) (2024-04-14)


### Bug Fixes

* **android:** map initialization as expected ([b57d22f](https://github.com/react-native-maps/react-native-maps/commit/b57d22f887f352d7be636b3cc9b60be8254ab850))
* **android:** map initialization as expected ([8ba7608](https://github.com/react-native-maps/react-native-maps/commit/8ba7608e90d188ee8bad50392968c60c5a2f15be))
* **android:** map initialization as expected ([7e1dd58](https://github.com/react-native-maps/react-native-maps/commit/7e1dd58e3bf3ea174e0a526926b14ef38340a195))
* **android:** map initialization as expected ([73640a6](https://github.com/react-native-maps/react-native-maps/commit/73640a6232f7e523c8962f6ab315bc9772ae154c))
* **android:** map initialization as expected ([6554793](https://github.com/react-native-maps/react-native-maps/commit/6554793a0287060dd946edae0a92de3482c2b14d))


### Features

* add support for new React Native architecture ([630b72e](https://github.com/react-native-maps/react-native-maps/commit/630b72ef90c2bcb8611ce907c4f359eefe40c555))
* add support for new React Native architecture ([48665da](https://github.com/react-native-maps/react-native-maps/commit/48665da2a581d300557d40fe740b8a28bb1cdc43))
* add support for new React Native architecture ([794c64f](https://github.com/react-native-maps/react-native-maps/commit/794c64f9288310a8da0bb5450011a8ef6236b952))
* add support for new React Native architecture ([1310985](https://github.com/react-native-maps/react-native-maps/commit/1310985e6e2c0d5b915d7364cf52a99cca43ec8f))
* add support for new React Native architecture ([39fd4e6](https://github.com/react-native-maps/react-native-maps/commit/39fd4e6e57cad141e640e4baf4ed3f60eccd6db4))
* Enable new arch for the example project ([1a21f86](https://github.com/react-native-maps/react-native-maps/commit/1a21f862b3b781707ae88e44db501f7453e95ac1))

## [1.13.2](https://github.com/react-native-maps/react-native-maps/compare/v1.13.1...v1.13.2) (2024-04-13)


### Bug Fixes

* **android:** googleMapOptions / initialising multiple maps on android is buggy ([#5034](https://github.com/react-native-maps/react-native-maps/issues/5034)) ([be28937](https://github.com/react-native-maps/react-native-maps/commit/be2893701f4d92e6e7d1b3917626c74352f75303))

## [1.13.1](https://github.com/react-native-maps/react-native-maps/compare/v1.13.0...v1.13.1) (2024-04-13)


### Bug Fixes

* **android:** onSelect was crashing android ([#5032](https://github.com/react-native-maps/react-native-maps/issues/5032)) ([b3ce3fc](https://github.com/react-native-maps/react-native-maps/commit/b3ce3fc4731b86107ea205d9ddb4743443c9523b))

# [1.13.0](https://github.com/react-native-maps/react-native-maps/compare/v1.12.0...v1.13.0) (2024-04-01)


### Features

* **google-init:** Improve Google Maps Initialisation on Android ([a1be51b](https://github.com/react-native-maps/react-native-maps/commit/a1be51bd882933da93dc50fcc7ae2219a1df58b4))

# [1.12.0](https://github.com/react-native-maps/react-native-maps/compare/v1.11.3...v1.12.0) (2024-03-29)


### Features

* **google-maps:** add onSelect/onDeselect support fo google maps ([#4990](https://github.com/react-native-maps/react-native-maps/issues/4990)) ([b9fbe31](https://github.com/react-native-maps/react-native-maps/commit/b9fbe31bb1feca4281a3131cc2a78dd64cca96d3))

## [1.11.3](https://github.com/react-native-maps/react-native-maps/compare/v1.11.2...v1.11.3) (2024-03-11)


### Bug Fixes

* AnimatedRegion types ([#4909](https://github.com/react-native-maps/react-native-maps/issues/4909)) ([5fd9ca6](https://github.com/react-native-maps/react-native-maps/commit/5fd9ca6dfb655145cfbf41f7f977855d8265b1f1))

## [1.11.2](https://github.com/react-native-maps/react-native-maps/compare/v1.11.1...v1.11.2) (2024-03-11)


### Bug Fixes

* **iOS:** removing polylines on iOS with googleProvider ([#4973](https://github.com/react-native-maps/react-native-maps/issues/4973)) ([6603060](https://github.com/react-native-maps/react-native-maps/commit/66030603a1808ef2c055f0abe2ab02f5e47cdf4c))

## [1.11.1](https://github.com/react-native-maps/react-native-maps/compare/v1.11.0...v1.11.1) (2024-03-10)


### Bug Fixes

* **android:** custom maker performance improvements when view tracking ([#4969](https://github.com/react-native-maps/react-native-maps/issues/4969)) ([f30c9d7](https://github.com/react-native-maps/react-native-maps/commit/f30c9d7624aa2f50afb7da97b6749fc45eb3125c))

# [1.11.0](https://github.com/react-native-maps/react-native-maps/compare/v1.10.4...v1.11.0) (2024-03-10)


### Features

* **android:** add bridgeless support ([#4985](https://github.com/react-native-maps/react-native-maps/issues/4985)) ([3ad0265](https://github.com/react-native-maps/react-native-maps/commit/3ad0265cd2e1fc357713ae2b8de71249c8425b50))

## [1.10.4](https://github.com/react-native-maps/react-native-maps/compare/v1.10.3...v1.10.4) (2024-03-10)


### Bug Fixes

* **android:** remove dangling map marker views causing memory leak ([#4992](https://github.com/react-native-maps/react-native-maps/issues/4992)) ([02ed7c0](https://github.com/react-native-maps/react-native-maps/commit/02ed7c04ec51789462a234cbddf0483d2c8116cd))

## [1.10.3](https://github.com/react-native-maps/react-native-maps/compare/v1.10.2...v1.10.3) (2024-02-18)


### Bug Fixes

* **animation:** Marker Animation using reanimated ([#4974](https://github.com/react-native-maps/react-native-maps/issues/4974)) ([7455ed0](https://github.com/react-native-maps/react-native-maps/commit/7455ed022117cbb45d232bc0f2a8ac5982bb8fd6))

## [1.10.2](https://github.com/react-native-maps/react-native-maps/compare/v1.10.1...v1.10.2) (2024-02-10)


### Bug Fixes

* **AIRMap:** support iOS MapKit zoomConstraints for better zoom handling especially for 3d maps ([#4905](https://github.com/react-native-maps/react-native-maps/issues/4905)) ([d83e1a9](https://github.com/react-native-maps/react-native-maps/commit/d83e1a9f4e5e93e0826ec810a35688eb6b4b4026))

## [1.10.1](https://github.com/react-native-maps/react-native-maps/compare/v1.10.0...v1.10.1) (2024-02-04)


### Bug Fixes

* EdgePadding types ([#4956](https://github.com/react-native-maps/react-native-maps/issues/4956)) ([de9e205](https://github.com/react-native-maps/react-native-maps/commit/de9e205c0955aee1951426bb9bf78440acac7119))

# [1.10.0](https://github.com/react-native-maps/react-native-maps/compare/v1.9.1...v1.10.0) (2024-01-21)


### Features

* **map:** add numberOfTouches to onPanDrag event on iOS ([#4934](https://github.com/react-native-maps/react-native-maps/issues/4934)) ([13f3903](https://github.com/react-native-maps/react-native-maps/commit/13f39030e35472ec639733ba3c469ae51283d806))

## [1.9.1](https://github.com/react-native-maps/react-native-maps/compare/v1.9.0...v1.9.1) (2024-01-05)


### Bug Fixes

* crash due to casting subview in iOS AIRGoogleMapMarker.m ([#4930](https://github.com/react-native-maps/react-native-maps/issues/4930)) ([4f38bd5](https://github.com/react-native-maps/react-native-maps/commit/4f38bd54e61bd93e26708c4d317ced3fa632cea9))

# [1.9.0](https://github.com/react-native-maps/react-native-maps/compare/v1.8.4...v1.9.0) (2024-01-02)


### Features

* **googleMaps:** add support for the new Google's cloud based maps / styling via googleMapId prop ([77610e9](https://github.com/react-native-maps/react-native-maps/commit/77610e96360a7cba3df72e8082d0eb4cae310d38))

## [1.8.4](https://github.com/react-native-maps/react-native-maps/compare/v1.8.3...v1.8.4) (2023-12-15)


### Bug Fixes

* **AIRMap:** fix location change timestamp ([7e5fb71](https://github.com/react-native-maps/react-native-maps/commit/7e5fb712f6f38973b666b406d904f51934f0fb55))

## [1.8.3](https://github.com/react-native-maps/react-native-maps/compare/v1.8.2...v1.8.3) (2023-12-07)


### Bug Fixes

* add missing subThoroughfare to Address type ([435798b](https://github.com/react-native-maps/react-native-maps/commit/435798b58cb7907cb43caf75fec6286fe0840d28))

## [1.8.2](https://github.com/react-native-maps/react-native-maps/compare/v1.8.1...v1.8.2) (2023-12-07)


### Bug Fixes

* **ios:** update google-maps-ios-utils version to 4.2.2 ([28f59c9](https://github.com/react-native-maps/react-native-maps/commit/28f59c9891ddd9f4f4774e1b4104f44d26f466f3))

## [1.8.1](https://github.com/react-native-maps/react-native-maps/compare/v1.8.0...v1.8.1) (2023-12-06)


### Bug Fixes

* **example:** fix typo in AndroidManifest.xml for ACCESS_COARSE_LOCATION permission ([a4a0f0d](https://github.com/react-native-maps/react-native-maps/commit/a4a0f0d91b9098b18081aab493a70008b0ca1436))

# [1.8.0](https://github.com/react-native-maps/react-native-maps/compare/v1.7.1...v1.8.0) (2023-10-09)


### Features

* **android:** Add android namespace to support react-native 0.73 ([#4859](https://github.com/react-native-maps/react-native-maps/issues/4859)) ([1c6c13d](https://github.com/react-native-maps/react-native-maps/commit/1c6c13d05705ed73c5ffdaf9f26648b44b7cb523))

## [1.7.1](https://github.com/react-native-maps/react-native-maps/compare/v1.7.0...v1.7.1) (2023-04-23)


### Bug Fixes

* **android:** crash when removing feature belonging to collection ([#4707](https://github.com/react-native-maps/react-native-maps/issues/4707)) ([ae6fe90](https://github.com/react-native-maps/react-native-maps/commit/ae6fe90d3f0c727441dd2cdc84c1800e18f18d04)), closes [#4706](https://github.com/react-native-maps/react-native-maps/issues/4706)

# [1.7.0](https://github.com/react-native-maps/react-native-maps/compare/v1.6.0...v1.7.0) (2023-04-23)


### Bug Fixes

* **ios:** followsUserLocation changes zoom level ([#4696](https://github.com/react-native-maps/react-native-maps/issues/4696)) ([3b9491e](https://github.com/react-native-maps/react-native-maps/commit/3b9491e39529f11b32b4da9eb4ef36353c0033d9)), closes [#4585](https://github.com/react-native-maps/react-native-maps/issues/4585)


### Features

* **android:** bump android-maps-utils to 3.4.0 ([#4699](https://github.com/react-native-maps/react-native-maps/issues/4699)) ([6b26c23](https://github.com/react-native-maps/react-native-maps/commit/6b26c235a26e2708497e5caf31176d8599441d9e))

# [1.7.0-beta.1](https://github.com/react-native-maps/react-native-maps/compare/v1.6.1-beta.1...v1.7.0-beta.1) (2023-04-21)


### Features

* **android:** bump android-maps-utils to 3.4.0 ([#4699](https://github.com/react-native-maps/react-native-maps/issues/4699)) ([6b26c23](https://github.com/react-native-maps/react-native-maps/commit/6b26c235a26e2708497e5caf31176d8599441d9e))

## [1.6.1-beta.1](https://github.com/react-native-maps/react-native-maps/compare/v1.6.0...v1.6.1-beta.1) (2023-04-21)


### Bug Fixes

* **ios:** followsUserLocation changes zoom level ([#4696](https://github.com/react-native-maps/react-native-maps/issues/4696)) ([3b9491e](https://github.com/react-native-maps/react-native-maps/commit/3b9491e39529f11b32b4da9eb4ef36353c0033d9)), closes [#4585](https://github.com/react-native-maps/react-native-maps/issues/4585)

# [1.6.0](https://github.com/react-native-maps/react-native-maps/compare/v1.5.0...v1.6.0) (2023-04-20)


### Bug Fixes

* force new release ([5bf2f24](https://github.com/react-native-maps/react-native-maps/commit/5bf2f2418d89dfbb060f9ee8277165d4d87bca69))
* force new release ([dfa2fa5](https://github.com/react-native-maps/react-native-maps/commit/dfa2fa5ed60bb5ec234ed572f18e23834b85f775))
* force new release ([4757d80](https://github.com/react-native-maps/react-native-maps/commit/4757d802c95151396c06652d94763028ba6cdd02))
* force new release ([71c4f1f](https://github.com/react-native-maps/react-native-maps/commit/71c4f1f05e8ba6ea96d9ed7dde0e344d01cea0a5))
* force new release ([53e8a66](https://github.com/react-native-maps/react-native-maps/commit/53e8a66bf32bab04555eea45da05fda8ce2b1e82))
* force new release ([afff010](https://github.com/react-native-maps/react-native-maps/commit/afff010a3a23f2e7c0770c6827e0c935272d3314))


### Features

* add support for release from yarn workspace ([fbcb1ee](https://github.com/react-native-maps/react-native-maps/commit/fbcb1ee22e52da6087ca3a0448add1b4ee9b4fac))
* add support for release from yarn workspace ([56d6e7b](https://github.com/react-native-maps/react-native-maps/commit/56d6e7b89e11e675a3995c3ea420c82dc935a4e1))
* add support for release from yarn workspace ([edc4b4b](https://github.com/react-native-maps/react-native-maps/commit/edc4b4b3833e7484470ebef102fd67ff43f733a4))
* monorepo to fix auto-linking for example and other issues ([4f70604](https://github.com/react-native-maps/react-native-maps/commit/4f7060414125c56d351876557fdd92bdb1589e74))
* monorepo to fix auto-linking for example and other issues ([7234a73](https://github.com/react-native-maps/react-native-maps/commit/7234a73a1c2c95b70351201e709b92d971ce2c84))
* monorepo to fix auto-linking for example and other issues ([66c1616](https://github.com/react-native-maps/react-native-maps/commit/66c1616759186ba5f143182757362aa33083280d))
* monorepo to fix auto-linking for example and other issues ([2083a7e](https://github.com/react-native-maps/react-native-maps/commit/2083a7e8286f404cb9736b8f4b1f6587d4c0aa5f))

# [1.25.0-alpha.6](https://github.com/react-native-maps/react-native-maps/compare/v1.25.0-alpha.5...v1.25.0-alpha.6) (2025-05-02)


### Bug Fixes

* force new release ([4757d80](https://github.com/react-native-maps/react-native-maps/commit/4757d802c95151396c06652d94763028ba6cdd02))

# [1.25.0-alpha.5](https://github.com/react-native-maps/react-native-maps/compare/v1.25.0-alpha.4...v1.25.0-alpha.5) (2025-05-02)


### Bug Fixes

* force new release ([71c4f1f](https://github.com/react-native-maps/react-native-maps/commit/71c4f1f05e8ba6ea96d9ed7dde0e344d01cea0a5))

# [1.25.0-alpha.4](https://github.com/react-native-maps/react-native-maps/compare/v1.25.0-alpha.3...v1.25.0-alpha.4) (2025-05-02)


### Bug Fixes

* force new release ([e9d61ad](https://github.com/react-native-maps/react-native-maps/commit/e9d61adc81b9dfe74e5c2395114c4b28165edc4e))

# [1.25.0-alpha.3](https://github.com/react-native-maps/react-native-maps/compare/v1.25.0-alpha.2...v1.25.0-alpha.3) (2025-05-02)


### Bug Fixes

* force new release ([53e8a66](https://github.com/react-native-maps/react-native-maps/commit/53e8a66bf32bab04555eea45da05fda8ce2b1e82))

# [1.25.0-alpha.2](https://github.com/react-native-maps/react-native-maps/compare/v1.25.0-alpha.1...v1.25.0-alpha.2) (2025-05-02)


### Bug Fixes

* force new release ([afff010](https://github.com/react-native-maps/react-native-maps/commit/afff010a3a23f2e7c0770c6827e0c935272d3314))

# [1.25.0-alpha.1](https://github.com/react-native-maps/react-native-maps/compare/v1.24.0...v1.25.0-alpha.1) (2025-05-02)


### Features

* add support for release from yarn workspace ([fbcb1ee](https://github.com/react-native-maps/react-native-maps/commit/fbcb1ee22e52da6087ca3a0448add1b4ee9b4fac))
* add support for release from yarn workspace ([56d6e7b](https://github.com/react-native-maps/react-native-maps/commit/56d6e7b89e11e675a3995c3ea420c82dc935a4e1))

# [1.24.0](https://github.com/react-native-maps/react-native-maps/compare/v1.23.0...v1.24.0) (2025-05-02)


### Features

* add support for release from yarn workspace ([9ce69f4](https://github.com/react-native-maps/react-native-maps/commit/9ce69f4956aa606fe7235d6f37ca39e4ea4c14f3))
* add support for release from yarn workspace ([edc4b4b](https://github.com/react-native-maps/react-native-maps/commit/edc4b4b3833e7484470ebef102fd67ff43f733a4))

# [1.23.0](https://github.com/react-native-maps/react-native-maps/compare/v1.22.6...v1.23.0) (2025-05-02)


### Features

* monorepo to fix auto-linking for example and other issues ([4f70604](https://github.com/react-native-maps/react-native-maps/commit/4f7060414125c56d351876557fdd92bdb1589e74))
* monorepo to fix auto-linking for example and other issues ([9f4ebc5](https://github.com/react-native-maps/react-native-maps/commit/9f4ebc58c740ca3db1d0e3db2c63a03eb0bfada8))
* monorepo to fix auto-linking for example and other issues ([0d12b70](https://github.com/react-native-maps/react-native-maps/commit/0d12b704ac5ede60312a44142e507c1d9b095056))
* monorepo to fix auto-linking for example and other issues ([2144f28](https://github.com/react-native-maps/react-native-maps/commit/2144f28ec80fae47e91c22c8c2eedc48ecaa7192))
* monorepo to fix auto-linking for example and other issues ([81a7008](https://github.com/react-native-maps/react-native-maps/commit/81a70085c5fe9f3bdc35769ffae9bcad49baca18))
* monorepo to fix auto-linking for example and other issues ([bd268a8](https://github.com/react-native-maps/react-native-maps/commit/bd268a803fc21b3825f113fa59d0849bf0934993))
* monorepo to fix auto-linking for example and other issues ([7234a73](https://github.com/react-native-maps/react-native-maps/commit/7234a73a1c2c95b70351201e709b92d971ce2c84))
* monorepo to fix auto-linking for example and other issues ([66c1616](https://github.com/react-native-maps/react-native-maps/commit/66c1616759186ba5f143182757362aa33083280d))
* monorepo to fix auto-linking for example and other issues ([2083a7e](https://github.com/react-native-maps/react-native-maps/commit/2083a7e8286f404cb9736b8f4b1f6587d4c0aa5f))
* update push.yml ([#5459](https://github.com/react-native-maps/react-native-maps/issues/5459)) ([0891663](https://github.com/react-native-maps/react-native-maps/commit/08916637c0a9948f177b282270e8aee157e2b3f4))

# [1.23.0](https://github.com/react-native-maps/react-native-maps/compare/v1.22.6...v1.23.0) (2025-05-02)


### Features

* monorepo to fix auto-linking for example and other issues ([4f70604](https://github.com/react-native-maps/react-native-maps/commit/4f7060414125c56d351876557fdd92bdb1589e74))
* monorepo to fix auto-linking for example and other issues ([9f4ebc5](https://github.com/react-native-maps/react-native-maps/commit/9f4ebc58c740ca3db1d0e3db2c63a03eb0bfada8))
* monorepo to fix auto-linking for example and other issues ([0d12b70](https://github.com/react-native-maps/react-native-maps/commit/0d12b704ac5ede60312a44142e507c1d9b095056))
* monorepo to fix auto-linking for example and other issues ([2144f28](https://github.com/react-native-maps/react-native-maps/commit/2144f28ec80fae47e91c22c8c2eedc48ecaa7192))
* monorepo to fix auto-linking for example and other issues ([81a7008](https://github.com/react-native-maps/react-native-maps/commit/81a70085c5fe9f3bdc35769ffae9bcad49baca18))
* monorepo to fix auto-linking for example and other issues ([bd268a8](https://github.com/react-native-maps/react-native-maps/commit/bd268a803fc21b3825f113fa59d0849bf0934993))
* monorepo to fix auto-linking for example and other issues ([7234a73](https://github.com/react-native-maps/react-native-maps/commit/7234a73a1c2c95b70351201e709b92d971ce2c84))
* monorepo to fix auto-linking for example and other issues ([66c1616](https://github.com/react-native-maps/react-native-maps/commit/66c1616759186ba5f143182757362aa33083280d))
* monorepo to fix auto-linking for example and other issues ([2083a7e](https://github.com/react-native-maps/react-native-maps/commit/2083a7e8286f404cb9736b8f4b1f6587d4c0aa5f))
* update push.yml ([#5459](https://github.com/react-native-maps/react-native-maps/issues/5459)) ([0891663](https://github.com/react-native-maps/react-native-maps/commit/08916637c0a9948f177b282270e8aee157e2b3f4))
