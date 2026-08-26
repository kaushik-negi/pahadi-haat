package com.pahadihaat.backend.config;

import com.pahadihaat.backend.model.Category;
import com.pahadihaat.backend.model.Product;
import com.pahadihaat.backend.model.Shop;
import com.pahadihaat.backend.repository.CategoryRepository;
import com.pahadihaat.backend.repository.ProductRepository;
import com.pahadihaat.backend.repository.ShopRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the same demo catalog the original static React frontend shipped with
 * (src/data/index.js), so the storefront looks identical on first run.
 * Seeded shops have no owner — a real seller who registers gets their own,
 * separate shop with an empty inventory.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository, ShopRepository shopRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            seedCategories();
        }
        if (shopRepository.count() == 0 && productRepository.count() == 0) {
            seedShopsAndProducts();
        }
    }

    private void seedCategories() {
        categoryRepository.saveAll(List.of(
                Category.builder().slug("medicine").label("Medicine").imageUrl("https://www.figma.com/api/mcp/asset/e26ac3c5-49f2-4262-a740-22b6ec7cb745.png").build(),
                Category.builder().slug("books").label("Books & Stationary").imageUrl("https://www.figma.com/api/mcp/asset/b23a0353-630a-4ad4-90f9-5b6825b33699.png").build(),
                Category.builder().slug("home-needs").label("Home needs").imageUrl("https://www.figma.com/api/mcp/asset/145f4f53-49ca-4720-8835-9eb68654d14e.png").build(),
                Category.builder().slug("hygiene").label("Hygiene & Wellness").imageUrl("https://www.figma.com/api/mcp/asset/df1e6ec8-70e8-4c8b-91f5-063ea3665c40.png").build(),
                Category.builder().slug("packaged-food").label("Packaged food").imageUrl("https://www.figma.com/api/mcp/asset/6ec99a5c-2448-483f-8349-66113b6bf856.png").build(),
                Category.builder().slug("cleaning").label("Cleaning Essentials").imageUrl("https://www.figma.com/api/mcp/asset/f22458ea-4b8c-40f8-9865-bb7965e360c4.png").build(),
                Category.builder().slug("apparel").label("Apparel & Lifestyle").imageUrl("https://www.figma.com/api/mcp/asset/e74ec95c-4a7a-4a0f-88e0-d5421e5eb254.png").build(),
                Category.builder().slug("electrical").label("Electrical & Accessories").imageUrl("https://www.figma.com/api/mcp/asset/7f47243a-2291-40e2-bb1c-9c34ca509005.png").build(),
                Category.builder().slug("makeup").label("Makeup & Beauty").imageUrl("https://www.figma.com/api/mcp/asset/70344c03-7413-4546-9f2a-8b9d208449bb.png").build()
        ));
    }

    private void seedShopsAndProducts() {
        Shop shop1 = shopRepository.save(Shop.builder().name("Arjun General Store").rating(4.0).distanceLabel("1.1 km away").address("Ganesh Chowk, Baurari").shopCode("HOP14XX80").build());
        Shop shop2 = shopRepository.save(Shop.builder().name("Himalayan Fresh Mart").rating(4.3).distanceLabel("2.4 km away").address("Tehri Road, Baurari").shopCode("HOP14XX81").build());
        Shop shop3 = shopRepository.save(Shop.builder().name("Mountain Basket").rating(3.8).distanceLabel("3.0 km away").address("Chamba Chowk, Tehri").shopCode("HOP14XX82").build());
        Shop shop4 = shopRepository.save(Shop.builder().name("Devbhoomi Traders").rating(4.6).distanceLabel("900 m away").address("Main Bazar, Tehri").shopCode("HOP14XX83").build());

        productRepository.saveAll(List.of(
                p("Sunfeast Dark Fantasy Choco Fills, Original Filled Cookies", "75 g", 38.0, 40.0, 5, shop1, "packaged-food", "https://www.figma.com/api/mcp/asset/d8288f58-35c4-45da-9b7a-0e58c414e3b7.png"),
                p("MAGGI 2-Minute Instant Masala Noodles", "140 g", 28.0, null, null, shop1, "packaged-food", "https://www.figma.com/api/mcp/asset/883768f9-7cac-4d13-8428-e97be34c62d7.png"),
                p("Cadbury Dairy Milk Chocolate Bar", "23 g", 20.0, null, null, shop1, "packaged-food", "https://www.figma.com/api/mcp/asset/4e8fe40b-d96d-4826-8f51-e3cce7688d9b.png"),
                p("Eastern Kashmiri Chilli", "100 g", 77.0, 110.0, 30, shop2, "home-needs", "https://www.figma.com/api/mcp/asset/00b80f4e-69fe-4521-949b-d9f02053dd03.png"),
                p("Prolyte ORS Liquid - Orange Flavour", "200 ml", 31.5, null, null, shop3, "medicine", "https://www.figma.com/api/mcp/asset/2d863a2a-b73e-4236-ae32-d589b3eef943.png"),
                p("Dairy Day New Triple Bar", "70 ml", 35.0, null, null, shop1, "packaged-food", "https://www.figma.com/api/mcp/asset/e18249a1-c807-4c03-9946-16224b614623.png"),
                p("Thums Up Soft Drink", "750 ml", 45.0, null, null, shop2, "packaged-food", "https://www.figma.com/api/mcp/asset/8eb0a86e-f4ad-4441-a52b-2dc7b42cff9d.png"),
                p("Lotte Choco Pie Chocolate Cake", "56 g", 27.0, 30.0, 10, shop1, "packaged-food", "https://www.figma.com/api/mcp/asset/f29cacde-0310-46ac-93a6-195f12b25016.png"),
                p("Bingo! Chilli Sprinkled Potato Chips", "45 g", 20.0, null, null, shop3, "packaged-food", "https://www.figma.com/api/mcp/asset/550dd4bf-ff78-4866-a0c8-7ec1dc4f434f.png"),
                p("Dabur Cold Pressed Mustard Oil", "1 L", 248.0, 310.0, 20, shop4, "home-needs", "https://www.figma.com/api/mcp/asset/851fb317-3490-408b-8132-248656d8eb66.png"),
                p("Mint Leaves", "100 g", 15.0, 19.0, 21, shop4, "home-needs", "https://www.figma.com/api/mcp/asset/b2a6b176-2700-44cc-b7d0-80600645f69e.png"),
                p("Earthmate Green Leaf Compostable Garbage Bags", "15 piece", 99.0, 130.0, 23, shop2, "cleaning", "https://www.figma.com/api/mcp/asset/c2598fc0-1fce-49dc-a5e8-174386bab650.png"),
                p("Nandini Pure Ghee (Pouch)", "500 ml", 315.0, null, null, shop1, "packaged-food", "https://www.figma.com/api/mcp/asset/e14b48d3-3b1a-41b0-b68d-4d2f1d602481.png"),
                p("Mars Chocolate 51 gms Combo", "51 g x 2", 128.0, 140.0, 8, shop3, "packaged-food", "https://www.figma.com/api/mcp/asset/cf5face5-807e-4d23-a44d-9e9c8779d66f.png"),
                p("Heritage Toned Fresh Milk (Pouch)", "500 ml", 25.0, null, null, shop1, "packaged-food", "https://www.figma.com/api/mcp/asset/da1e40ac-c85f-4dd5-b9e1-1dfe884ff641.png"),
                p("Heritage Total Curd Pouch", "475 g", 31.0, 33.0, 6, shop1, "packaged-food", "https://www.figma.com/api/mcp/asset/ab442ab0-e770-4cc5-af2f-df62abf5167f.png"),
                p("NESCAFE Sunrise Instant Coffee - Chicory Mix Pouch", "50 g", 120.0, null, null, shop2, "packaged-food", "https://www.figma.com/api/mcp/asset/c4c81150-7265-48e2-96a4-a18bacacd029.png"),
                p("Lotte Choco Pie Chocolate Cake 56 gms Combo", "56 g x 2", 54.0, 60.0, 10, shop1, "packaged-food", "https://www.figma.com/api/mcp/asset/edf343ea-b315-4cc6-b81c-7caa5a1d20ab.png"),
                p("Ching's Secret Dark Soy Sauce Bottle", "210 g", 50.0, 60.0, 16, shop4, "home-needs", "https://www.figma.com/api/mcp/asset/8eddd92e-480e-4a40-9a31-1e889cdb0278.png"),
                p("Eveready Carbon Zinc Battery AA (Pack of 4)", "", 55.0, 65.0, 15, shop2, "electrical", "https://www.figma.com/api/mcp/asset/c67dccae-d319-43a8-bcd2-1b721c2f650d.png")
        ));
    }

    private Product p(String title, String weight, Double price, Double old, Integer off, Shop shop, String category, String img) {
        return Product.builder()
                .title(title).weight(weight).price(price).oldPrice(old).discountPercent(off)
                .shop(shop).category(category).imageUrl(img).stockQty(25)
                .build();
    }
}
