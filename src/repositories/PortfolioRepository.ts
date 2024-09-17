import { injectable } from 'inversify';
import { GenericRepository } from './generic/GenericRepository';
import Portfolio, { PortfolioAttributes, PortfolioCreationAttributes } from '../models/portfolio/Portfolio';
import Share from '../models/share/Share';
import PortfolioHoldings from '../models/portfolio/PortfolioHoldings';

@injectable()
class PortfolioRepository extends GenericRepository<Portfolio, PortfolioAttributes, PortfolioCreationAttributes> {
  constructor() {
    super(Portfolio); // PortfolioHoldings modelini BaseRepository'ye geçiriyoruz
  }

  // Kullanıcının portföyünü getir
  public async findByUserId(userId: number): Promise<PortfolioHoldings[]> {
    const portfolio_id = await Portfolio.findOne({
      where: { user_id: userId },
      attributes: ['portfolio_id'],
    });

    if (!portfolio_id) {
      return [];
    }

    const portfolioHoldings = await PortfolioHoldings.findAll({
      where: { portfolio_id: portfolio_id.portfolio_id },
      include: Share,
    });

    return portfolioHoldings;
  }
}

export default PortfolioRepository;
